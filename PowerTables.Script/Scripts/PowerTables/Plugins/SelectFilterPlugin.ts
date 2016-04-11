module PowerTables.Plugins {
    import SelectFilterUiConfig = PowerTables.Filters.Select.ISelectFilterUiConfig;

    export class SelectFilterPlugin extends FilterBase<SelectFilterUiConfig> {
        FilterValueProvider: HTMLSelectElement;
        private _associatedColumn: IColumn;

        getArgument(): string {
            return this.getSelectionArray().join('|');
        }

        getSelectionArray():string[] {
            if (!this.Configuration.IsMultiple) {
                var selected = this.FilterValueProvider.options[this.FilterValueProvider.selectedIndex];
                return [selected.value];

            } else {
                var elemValues = [];
                for (var i = 0, iLen = this.FilterValueProvider.options.length; i < iLen; i++) {
                    var opt = this.FilterValueProvider.options[i];

                    if (opt.selected) {
                        elemValues.push(opt.value);
                    }
                }
                return elemValues;
            }
        }
        modifyQuery(query: IQuery, scope: QueryScope): void {
            var val = this.getArgument();
            if (!val || val.length === 0) return;

            if (this.Configuration.ClientFiltering && scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
            if ((!this.Configuration.ClientFiltering) && scope === QueryScope.Server || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
        }

        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('selectFilter')(this);
        }

        public handleValueChanged() {
           this.MasterTable.Controller.reload();
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._associatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
            if (this.Configuration.AllowSelectNothing) {
                var nothingItem = { Value: '', Text: this.Configuration.NothingText || '-', Disabled: false, Selected: false };

                this.Configuration.Items = [nothingItem].concat(this.Configuration.Items);
            }

            var sv = this.Configuration.SelectedValue;
            if (sv !== undefined && sv !== null) {
                for (var i = 0; i < this.Configuration.Items.length; i++) {
                    if (this.Configuration.Items[i].Value !== sv) {
                        this.Configuration.Items[i].Selected = false;
                    } else {
                        this.Configuration.Items[i].Selected = true;
                    }
                }
            }

            if (this.Configuration.ClientFiltering) {
                this.itIsClientFilter();
            }
        }

        filterPredicate(rowObject, query: IQuery): boolean {
            var fval = query.Filterings[this._associatedColumn.RawName];
            if (!fval) return true;

            var arr = fval.split('|');

            if (this.Configuration.ClientFilteringFunction) {
                return this.Configuration.ClientFilteringFunction(rowObject, arr, query);
            }

            if (!query.Filterings.hasOwnProperty(this._associatedColumn.RawName)) return true;
            var objVal = rowObject[this._associatedColumn.RawName];
            if (objVal == null) return false;

            if (this._associatedColumn.IsString) {
                return arr.indexOf(objVal) >= 0;
            }

            var single = false;
            if (this._associatedColumn.IsFloat) {
                
                arr.map((v, idx, arr) => {
                    if (parseFloat(v) === objVal) single = true;
                });
                return single;
            }

            if (this._associatedColumn.IsInteger || this._associatedColumn.IsEnum) {
                single = false;
                arr.map((v, idx, arr) => {
                    if (parseInt(v) === objVal) single = true;
                });
                return single;
            }

            if (this._associatedColumn.IsBoolean) {
                single = false;
                arr.map((v, idx, arr) => {
                    var bv = v.toLocaleUpperCase() === 'TRUE' ? true :
                        v.toLocaleUpperCase() === 'FALSE' ? false : null;

                    if (bv == null) {
                        bv = parseInt(fval) > 0;
                    }
                    
                    if (bv === objVal) {
                        single = true;
                    }
                    
                });
                return single;
            }

            return true;
        }
    }
    ComponentsContainer.registerComponent('SelectFilter', SelectFilterPlugin);
} 