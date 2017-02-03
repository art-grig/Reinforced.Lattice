﻿module PowerTables.Filters.Range {
    export class RangeFilterPlugin extends PowerTables.Filters.FilterBase<Filters.Range.IRangeFilterUiConfig> {
        private _filteringIsBeingExecuted: boolean = false;
        private _inpTimeout: any;
        private _fromPreviousValue: string;
        private _toPreviousValue: string;
        public AssociatedColumn: IColumn;
        private _isInitializing: boolean = true;

        public FromValueProvider: HTMLInputElement;
        public ToValueProvider: HTMLInputElement;

        private getFromValue(): string {
            if (this.AssociatedColumn.Configuration.IsDataOnly) {
                return this.Configuration.FromValue;
            }
            if (!this.FromValueProvider) return '';
            if (this.AssociatedColumn.IsDateTime) {
                var date = this.MasterTable.Date.getDateFromDatePicker(this.FromValueProvider);
                return this.MasterTable.Date.serialize(date);
            }
            return this.FromValueProvider.value;
        }

        private getToValue(): string {
            if (this.AssociatedColumn.Configuration.IsDataOnly) {
                return this.Configuration.ToValue;
            }
            if (!this.ToValueProvider) return '';
            if (this.AssociatedColumn.IsDateTime) {
                var date = this.MasterTable.Date.getDateFromDatePicker(this.ToValueProvider);
                return this.MasterTable.Date.serialize(date);
            }
            return this.ToValueProvider.value;
        }

        public handleValueChanged() {
            if (this._isInitializing) return;
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

        public getFilterArgument(): string {
            var args: any[] = [];
            var frm: string = this.getFromValue();
            var to: string = this.getToValue();
            args.push(frm);
            args.push(to);
            var result: string = args.join('|');
            return result;
        }

        public modifyQuery(query: IQuery, scope: QueryScope): void {
            if (this.Configuration.Hidden) return;
            var val: string = this.getFilterArgument();
            if (!val || val.length === 0) return;
            if (this.Configuration.ClientFiltering && scope === QueryScope.Client || scope === QueryScope.Transboundary) {
                query.Filterings[this.AssociatedColumn.RawName] = val;
            }
            if ((!this.Configuration.ClientFiltering) && scope === QueryScope.Server || scope === QueryScope.Transboundary) {
                query.Filterings[this.AssociatedColumn.RawName] = val;
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.ClientFiltering) {
                this.itIsClientFilter();
            }
            this.AssociatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
        }

        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            if (this.Configuration.Hidden) return;
            this.defaultRender(p);
        }

        public filterPredicate(rowObject: any, query: IQuery): boolean {
            var fval: string = query.Filterings[this.AssociatedColumn.RawName];
            if (!fval) return true;
            var args: string[] = fval.split('|');
            var fromValue: string = args[0];
            var toValue: string = args[1];

            if (this.Configuration.ClientFilteringFunction) {
                return this.Configuration.ClientFilteringFunction(rowObject, fromValue, toValue, query);
            }

            var frmEmpty: boolean = fromValue.trim().length === 0;
            var toEmpty: boolean = toValue.trim().length === 0;
            if (frmEmpty && toEmpty) return true;

            if (!query.Filterings.hasOwnProperty(this.AssociatedColumn.RawName)) return true;

            var objVal = rowObject[this.AssociatedColumn.RawName];
            if (objVal == null) return false;


            if (this.AssociatedColumn.IsString) {
                var str = objVal.toString();
                return ((frmEmpty) || str.localeCompare(fromValue) >= 0) && ((toEmpty) || str.localeCompare(toValue) <= 0);
            }

            if (this.AssociatedColumn.IsFloat) {
                return ((frmEmpty) || objVal >= parseFloat(fromValue)) && ((toEmpty) || objVal <= parseFloat(toValue));
            }

            if (this.AssociatedColumn.IsInteger || this.AssociatedColumn.IsEnum) {
                return ((frmEmpty) || objVal >= parseInt(fromValue)) && ((toEmpty) || objVal <= parseInt(toValue));
            }

            if (this.AssociatedColumn.IsDateTime) {
                var toVal;
                if (!toEmpty) {
                    toVal = this.MasterTable.Date.parse(toValue);
                    if (this.Configuration.TreatEqualDateAsWholeDay) {
                        toVal.setHours(23);
                        toVal.setMinutes(59);
                        toVal.setSeconds(59);
                    }
                }
                return ((frmEmpty) || objVal >= this.MasterTable.Date.parse(fromValue)) && ((toEmpty) || objVal <= toVal);
            }

            return true;
        }

        public afterDrawn = (e) => {
            if (this.Configuration.Hidden) return;
            if (this.AssociatedColumn.IsDateTime) {
                var fromDate = this.MasterTable.Date.parse(this.Configuration.FromValue);
                var toDate = this.MasterTable.Date.parse(this.Configuration.ToValue);

                this.MasterTable.Date.putDateToDatePicker(this.FromValueProvider, fromDate);
                this.MasterTable.Date.putDateToDatePicker(this.ToValueProvider, toDate);
            }
            this._isInitializing = false;
        }
    }

    ComponentsContainer.registerComponent('RangeFilter', RangeFilterPlugin);
}