module PowerTables.Plugins {
    export class ValueFilterPlugin extends FilterBase<Filters.Value.IValueFilterUiConfig> {
        private _filteringIsBeingExecuted: boolean = false;
        private _inpTimeout: any;
        private _previousValue: string;
        public AssociatedColumn: IColumn;
        private _isInitializing: boolean = true;

        public FilterValueProvider: HTMLInputElement;

        private getValue() {
            if (!this.FilterValueProvider) return '';
            if (this.AssociatedColumn.IsDateTime) {
                return this.MasterTable.Date.serialize(this.MasterTable.Date.getDateFromDatePicker(this.FilterValueProvider));
            }
            return this.FilterValueProvider.value;
        }

        public handleValueChanged() {
            if (this._isInitializing) return;
            if (this._filteringIsBeingExecuted) return;

            if (this.getValue() === this._previousValue) {
                return;
            }
            this._previousValue = this.getValue();
            if (this.Configuration.InputDelay > 0) {
                clearTimeout(this._inpTimeout);
                this._inpTimeout = setTimeout(() => {
                    this._filteringIsBeingExecuted = true;
                    this.MasterTable.Controller.reload();
                    this._filteringIsBeingExecuted = false;
                }, this.Configuration.InputDelay);

            } else {
                this._filteringIsBeingExecuted = true;
                this.MasterTable.Controller.reload();
                this._filteringIsBeingExecuted = false;
            }
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            if (this.Configuration.Hidden) return '';
            return this.defaultRender(templatesProvider);
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.ClientFiltering) {
                this.itIsClientFilter();
            }
            this.AssociatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];

        }

        public filterPredicate(rowObject: any, query: IQuery): boolean {
            var fval: string = query.Filterings[this.AssociatedColumn.RawName];
            if (fval == null || fval == undefined) return true;
            if (fval === '$$lattice_not_present$$' && this.AssociatedColumn.Configuration.IsNullable) fval = null;

            if (this.Configuration.ClientFilteringFunction) {
                return this.Configuration.ClientFilteringFunction(rowObject, fval, query);
            }

            if (!query.Filterings.hasOwnProperty(this.AssociatedColumn.RawName)) return true;
            var objVal = rowObject[this.AssociatedColumn.RawName];
            if (objVal == null) return fval == null;
            if (this.AssociatedColumn.IsString) {
                objVal = objVal.toString();
                var entries: string[] = fval.split(/\s/);
                for (var i: number = 0; i < entries.length; i++) {
                    var e: string = entries[i].trim();
                    if (e.length > 0) {
                        if (objVal.toLocaleLowerCase().indexOf(e.toLocaleLowerCase()) < 0) return false;
                    }
                }
                return true;
            }

            if (this.AssociatedColumn.IsFloat) {
                var f: number = parseFloat(fval);
                return objVal === f;
            }

            if (this.AssociatedColumn.IsInteger || this.AssociatedColumn.IsEnum) {
                var int: number = parseInt(fval);
                return objVal === int;
            }

            if (this.AssociatedColumn.IsBoolean) {
                var bv: boolean = fval.toLocaleUpperCase() === 'TRUE' ? true :
                    fval.toLocaleUpperCase() === 'FALSE' ? false : null;
                if (bv == null) {
                    bv = parseInt(fval) > 0;
                }
                return objVal === bv;
            }

            if (this.AssociatedColumn.IsDateTime) {
                var date = this.MasterTable.Date.parse(fval);
                return date === objVal;
            }

            return true;
        }

        public modifyQuery(query: IQuery, scope: QueryScope): void {
            if (this.Configuration.Hidden) return;
            var val: string = this.getValue();
            if (!val || val.length === 0) return;
            if (this.Configuration.ClientFiltering && scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                query.Filterings[this.AssociatedColumn.RawName] = val;
            }
            if ((!this.Configuration.ClientFiltering) && scope === QueryScope.Server || scope === QueryScope.Transboundary) {
                query.Filterings[this.AssociatedColumn.RawName] = val;
            }
        }

        public afterDrawn = (e) => {
            if (this.Configuration.Hidden) return;
            if (this.AssociatedColumn.IsDateTime) {
                var date = this.MasterTable.Date.parse(this.Configuration.DefaultValue);
                this.MasterTable.Date.putDateToDatePicker(this.FilterValueProvider, date);
            }
            this._isInitializing = false;
        }
    }

    ComponentsContainer.registerComponent('ValueFilter', ValueFilterPlugin);
}