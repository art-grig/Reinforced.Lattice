﻿module PowerTables.Filters.Select {
    /**
     * Client-side implementation of Select filter
     */
    export class SelectFilterPlugin extends PowerTables.Filters.FilterBase<Filters.Select.ISelectFilterUiConfig> {

        /**
         * HTML element of select list supplying values for select filter. 
         */
        public FilterValueProvider: HTMLSelectElement;
        public AssociatedColumn: IColumn;

        /**
         * Retrieves selected values serialized with |-delimiter
         */
        public getSerializedValue(): string {
            if (this.AssociatedColumn.Configuration.IsDataOnly && this.Configuration.SelectedValue) {
                return this.Configuration.SelectedValue;
            }
            return this.getArrayValue().join('|');
        }

        /**
         * Retrieves array of stringified selected values
         */
        public getArrayValue(): string[] {
            if (!this.FilterValueProvider) return [];

            if (!this.Configuration.IsMultiple) {
                var selected = (<any>this.FilterValueProvider.options[this.FilterValueProvider.selectedIndex]);
                return [selected.value];

            } else {
                var elemValues: any[] = [];
                for (var i: number = 0, iLen: number = this.FilterValueProvider.options.length; i < iLen; i++) {
                    var opt = (<any>this.FilterValueProvider.options[i]);

                    if (opt.selected) {
                        elemValues.push(opt.value);
                    }
                }
                return elemValues;
            }
        }

        /**
         * @internal
         */
        public modifyQuery(query: IQuery, scope: QueryScope): void {
            if (this.Configuration.Hidden) return;
            var val: string = this.getSerializedValue();
            if (!val || val.length === 0) return;

            if (this.Configuration.ClientFiltering && scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                query.Filterings[this.AssociatedColumn.RawName] = val;
            }
            if ((!this.Configuration.ClientFiltering) && scope === QueryScope.Server || scope === QueryScope.Transboundary) {
                query.Filterings[this.AssociatedColumn.RawName] = val;
            }
        }

        /**
         * @internal
         */
        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            if (this.Configuration.Hidden) return;
            this.defaultRender(p);
        }

        /**
         * @internal
         */
        public handleValueChanged() {
            this.MasterTable.Controller.reload();
        }

        /**
         * @internal
         */
        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.AssociatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];

            var sv: string = this.Configuration.SelectedValue;
            if (sv !== undefined && sv !== null) {
                for (var i: number = 0; i < this.Configuration.Items.length; i++) {
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

/**        
 * @internal
 */
        public filterPredicate(rowObject: any, query: IQuery): boolean {
            var fval: string = query.Filterings[this.AssociatedColumn.RawName];
            if (fval == null || fval == undefined) return true;
            if (fval === '$$lattice_not_present$$' && this.AssociatedColumn.Configuration.IsNullable) fval = null;
            var arr: string[] = null;
            if (this.Configuration.IsMultiple) {
                arr = fval != null ? fval.split('|') : [null];
            } else {
                arr = [fval];
            }

            if (this.Configuration.ClientFilteringFunction) {
                return this.Configuration.ClientFilteringFunction(rowObject, arr, query);
            }

            if (!query.Filterings.hasOwnProperty(this.AssociatedColumn.RawName)) return true;
            var objVal = rowObject[this.AssociatedColumn.RawName];
            if (objVal == null) return arr.indexOf(null) > -1;

            if (this.AssociatedColumn.IsString) {
                return arr.indexOf(objVal) >= 0;
            }

            var single: boolean = false;
            if (this.AssociatedColumn.IsFloat) {

                arr.map((v) => {
                    if (parseFloat(v) === objVal) single = true;
                });
                return single;
            }

            if (this.AssociatedColumn.IsInteger || this.AssociatedColumn.IsEnum) {
                single = false;
                arr.map((v) => {
                    if (parseInt(v) === objVal) single = true;
                });
                return single;
            }

            if (this.AssociatedColumn.IsBoolean) {
                single = false;
                arr.map((v) => {
                    var bv: boolean = v.toLocaleUpperCase() === 'TRUE' ? true :
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