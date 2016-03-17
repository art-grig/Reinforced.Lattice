module PowerTables {
    import RangeFilterClientConfig = PowerTables.Filters.Range.IRangeFilterClientConfig;

    export class RangeFilter extends FilterBase<RangeFilterClientConfig> {
        constructor(column: IColumn) {
            super('pt-rangefilter', column);
        }
        private _fromElement: JQuery;
        private _toElement: JQuery;
        private _filteringIsBeingExecuted: boolean = false;
        private _inpTimeout: any;
        private _fromPreviousValue: string;
        private _toPreviousValue: string;

        subscribeEvents(parentElement: JQuery): void {
            var _self = this;
            this._fromElement = parentElement.find(`input[data-for='${this.Column.RawName}'][data-rng='from']`);
            this._toElement = parentElement.find(`input[data-for='${this.Column.RawName}'][data-rng='to']`);
            if (this.IsDateTime) {
                this.Table.Renderer.createDatepicker(this._fromElement);
                this.Table.Renderer.createDatepicker(this._toElement);
            }
            if (this.Configuration.FromValue) {
                this._fromElement.val(this.Configuration.FromValue);
            }
            if (this.Configuration.ToValue) {
                this._toElement.val(this.Configuration.ToValue);
            }
            this._fromElement.bind('keyup change',function (e) {
                _self.handleValueChanged();
            });

            this._toElement.bind('keyup change',function (e) {
                _self.handleValueChanged();
            });
            this._fromPreviousValue = this._fromElement.val();
            this._toPreviousValue = this._toElement.val();

        }

        handleValueChanged() {
            if (this._filteringIsBeingExecuted) return;
            
            if ((this._fromPreviousValue === this._fromElement.val())
                    && (this._toPreviousValue === this._toElement.val())
            ) {
                return;
            }
            this._fromPreviousValue = this._fromElement.val();
            this._toPreviousValue = this._toElement.val();
            if (this.Configuration.InputDelay > 0) {
                clearTimeout(this._inpTimeout);
                this._inpTimeout = setTimeout(() => {
                    this._filteringIsBeingExecuted = true;
                    this.Table.reload();
                    this._filteringIsBeingExecuted = false;
                }, this.Configuration.InputDelay);
            } else {
                this._filteringIsBeingExecuted = true;
                this.Table.reload();
                this._filteringIsBeingExecuted = false;
            }
        }

        getArgument(): string {
            var args = [];
            if (this._fromElement) {
                var v = this._fromElement.val();
                args.push(v);
            }
            if (this._toElement) {
                var v2 = this._toElement.val();
                args.push(v2);
            }
            var result = args.join('|');
            return result;
        }

        reset(): void {
            if (this._fromElement) {
                this._fromElement.val('');
            }
            if (this._toElement) {
                this._toElement.val('');
            }
        }
    }

    ComponentsContainer.registerComponent('RangeFilter', RangeFilter);
} 