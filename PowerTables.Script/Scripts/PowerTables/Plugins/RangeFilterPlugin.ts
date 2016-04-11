﻿module PowerTables.Plugins {
    import RangeFilterUiConfig = PowerTables.Filters.Range.IRangeFilterUiConfig;

    export class RangeFilterPlugin extends FilterBase<RangeFilterUiConfig> {
        private _filteringIsBeingExecuted: boolean = false;
        private _inpTimeout: any;
        private _fromPreviousValue: string;
        private _toPreviousValue: string;
        private _associatedColumn: IColumn;

        public FromValueProvider: HTMLInputElement;
        public ToValueProvider: HTMLInputElement;

        private getFromValue() :string {
            return this.FromValueProvider.value;
        }

        private getToValue(): string {
            return this.ToValueProvider.value;
        }

        public handleValueChanged() {
            if (this._filteringIsBeingExecuted) return;

            if ((this._fromPreviousValue === this.getFromValue())
                && (this._toPreviousValue === this.getToValue())) return;

            this._fromPreviousValue = this.getFromValue();
            this._toPreviousValue = this.getToValue();
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
        getFilterArgument(): string {
            var args = [];
            var frm = this.getFromValue();
            var to = this.getToValue();
            args.push(frm);
            args.push(to);
            var result = args.join('|');
            return result;
        }

        modifyQuery(query: IQuery, scope: QueryScope): void {
            var val = this.getFilterArgument();
            if (!val || val.length === 0) return;
            if (this.Configuration.ClientFiltering && scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
            if ((!this.Configuration.ClientFiltering) && scope === QueryScope.Server || scope === QueryScope.Transboundary) {
                query.Filterings[this._associatedColumn.RawName] = val;
            }
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.ClientFiltering) {
                this.itIsClientFilter();
            }
            this._associatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
        }

        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('rangeFilter')(this);
        }

        filterPredicate(rowObject, query: IQuery): boolean {
            var fval = query.Filterings[this._associatedColumn.RawName];
            if (!fval) return true;
            var args = fval.split('|');
            var fromValue = args[0];
            var toValue = args[1];
            
            if (this.Configuration.ClientFilteringFunction) {
                return this.Configuration.ClientFilteringFunction(rowObject,fromValue,toValue, query);
            }

            var frmEmpty = fromValue.trim().length === 0;
            var toEmpty = toValue.trim().length === 0;
            if (frmEmpty && toEmpty) return true;

            if (!query.Filterings.hasOwnProperty(this._associatedColumn.RawName)) return true;
            
            var objVal = rowObject[this._associatedColumn.RawName];
            if (objVal == null) return false;

            
            if (this._associatedColumn.IsString) {
                var str = objVal.toString();
                return ((frmEmpty) || str.localeCompare(fromValue) >= 0) && ((toEmpty) || str.localeCompare(toValue) <= 0);
            }

            if (this._associatedColumn.IsFloat) {
                return ((frmEmpty) || objVal >= parseFloat(fromValue)) && ((toEmpty) || objVal <= parseFloat(toValue));
            }

            if (this._associatedColumn.IsInteger || this._associatedColumn.IsEnum) {
                return ((frmEmpty) || objVal >= parseInt(fromValue)) && ((toEmpty) || objVal <= parseInt(toValue));
            }

            return true;
        }
    }
    ComponentsContainer.registerComponent('RangeFilter', RangeFilterPlugin);
} 