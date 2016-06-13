module PowerTables.Plugins {
    /**
     * Client-side part of value filter
     */
    export class ValueFilterPlugin extends FilterBase<Filters.Value.IValueFilterUiConfig> {
        private _filteringIsBeingExecuted: boolean = false;
        private _inpTimeout: any;
        private _previousValue: string;
        private _associatedColumn: IColumn;
        private _isInitializing: boolean = true;

        /**
         * HTML element corresponding to <input/> tag this filter will retrieve value from
         */
        public FilterValueProvider: HTMLInputElement;

        /**
         * Retrieves entered value. Could be either string or Date object depending on 
         * column associated within filter
         */
        public getValue() {
            if (!this.FilterValueProvider) return '';
            if (this._associatedColumn.IsDateTime) {
                return this.MasterTable.Date.serialize(this.MasterTable.Date.getDateFromDatePicker(this.FilterValueProvider));
            }
            return this.FilterValueProvider.value;
        }

/**
* @internal
*/
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
/**
* @internal
*/
        public renderContent(templatesProvider: ITemplatesProvider): string {
            if (this.Configuration.Hidden) return '';
            return this.defaultRender(templatesProvider);
        }
/**
* @internal
*/
        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.ClientFiltering) {
                this.itIsClientFilter();
            }
            this._associatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];

        }
/**
* @internal
*/
        public filterPredicate(rowObject: any, query: IQuery): boolean {
            var fval: string = query.Filterings[this._associatedColumn.RawName];
            if (fval == null || fval == undefined) return true;
            if (fval === '$$lattice_not_present$$' && this._associatedColumn.Configuration.IsNullable) fval = null;

            if (this.Configuration.ClientFilteringFunction) {
                return this.Configuration.ClientFilteringFunction(rowObject, fval, query);
            }

            if (!query.Filterings.hasOwnProperty(this._associatedColumn.RawName)) return true;
            var objVal = rowObject[this._associatedColumn.RawName];
            if (objVal == null) return fval == null;
            if (this._associatedColumn.IsString) {
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

            if (this._associatedColumn.IsFloat) {
                var f: number = parseFloat(fval);
                return objVal === f;
            }

            if (this._associatedColumn.IsInteger || this._associatedColumn.IsEnum) {
                var int: number = parseInt(fval);
                return objVal === int;
            }

            if (this._associatedColumn.IsBoolean) {
                var bv: boolean = fval.toLocaleUpperCase() === 'TRUE' ? true :
                    fval.toLocaleUpperCase() === 'FALSE' ? false : null;
                if (bv == null) {
                    bv = parseInt(fval) > 0;
                }
                return objVal === bv;
            }

            if (this._associatedColumn.IsDateTime) {
                var date = this.MasterTable.Date.parse(fval);
                return date === objVal;
            }

            return true;
        }
/**
* @internal
*/
        public modifyQuery(query: IQuery, scope: QueryScope): void {
            if (this.Configuration.Hidden) return;
            var val: string = this.getValue();
            if (!val || val.length === 0) return;
            if (this.Configuration.ClientFiltering && scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
            if ((!this.Configuration.ClientFiltering) && scope === QueryScope.Server || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
        }
/**
* @internal
*/
        public afterDrawn = (e) => {
            if (this.Configuration.Hidden) return;
            if (this._associatedColumn.IsDateTime) {
                var date = this.MasterTable.Date.parse(this.Configuration.DefaultValue);
                this.MasterTable.Date.putDateToDatePicker(this.FilterValueProvider, date);
            }
            this._isInitializing = false;
        }
    }

    ComponentsContainer.registerComponent('ValueFilter', ValueFilterPlugin);
}