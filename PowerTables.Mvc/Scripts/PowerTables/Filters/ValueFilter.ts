module PowerTables {
    import ValueFilterClientConfig = PowerTables.Filters.Value.IValueFilterClientConfig;

    export class ValueFilter extends FilterBase<ValueFilterClientConfig> {
        constructor(column: IColumn) {
            super('pt-valuefilter', column);
            
        }
        private _inputElement: JQuery;
        private _filteringIsBeingExecuted: boolean = false;
        private _inpTimeout:any;
        private _previousValue: string;

        subscribeEvents(parentElement: JQuery): void {
            var _self = this;
            this._inputElement = parentElement.find(`input[data-for='${this.Column.RawName}']`);
            if (this.Configuration.DefaultValue) {
                this._inputElement.val(this.Configuration.DefaultValue);
            }
            if (this.IsDateTime) this.Table.Renderer.createDatepicker(this._inputElement);
            this._inputElement.bind('keyup change',function (e) {
                _self.handleValueChanged();
            });
            this._previousValue = this._inputElement.val();
        }

        handleValueChanged() {
            
            if (this._filteringIsBeingExecuted) return;

            if (this._inputElement.val() === this._previousValue) {
                return;
            }
            this._previousValue = this._inputElement.val();
            if (this.Configuration.InputDelay > 0) {
                clearTimeout(this._inpTimeout);
                this._inpTimeout = setTimeout(() => {
                    this._filteringIsBeingExecuted = true;
                    this.Table.reload();
                    this._filteringIsBeingExecuted = false;
                }, 500);

            } else {
                this._filteringIsBeingExecuted = true;
                this.Table.reload();
                this._filteringIsBeingExecuted = false;
            }
        }

        getArgument(): string {
            if (this._inputElement) {
                var v = this._inputElement.val();
                return v;
            }
            return '';
        }

        reset(): void {
            if (this._inputElement) {
                this._inputElement.val('');
            }
        }
    }

    ComponentsContainer.registerComponent('ValueFilter', ValueFilter);
} 