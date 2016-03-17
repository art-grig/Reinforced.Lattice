module PowerTables {
    import SelectFilterClientConfig = PowerTables.Filters.Select.ISelectFilterClientConfig;

    export class SelectFilter extends FilterBase<SelectFilterClientConfig> {
        constructor(column: IColumn) {
            super('pt-selectfilter', column);
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
            

        }
        private _selectElement: JQuery;
        private _filteringIsBeingExecuted: boolean = false;
        
        subscribeEvents(parentElement: JQuery): void {
            var _self = this;
            this._selectElement = parentElement.find(`select[data-for='${this.Column.RawName}']`);
            this._selectElement.change(function (e) {
                _self.handleValueChanged();
            });
        }

        handleValueChanged() {
            this.Table.reload();
        }

        getArgument(): string {
            if (this._selectElement) {
                if (!this.Configuration.IsMultiple) {
                    var v = this._selectElement.val();
                    return v;
                } else {
                    var elemValues = [];
                    this._selectElement.find('option:selected').each(function() {
                        elemValues.push($(this).val());
                    });
                    return elemValues.join('|');
                }
            }
            return '';
        }

        reset(): void {
            if (this._selectElement) {
                this._selectElement.find('option:selected').removeAttr('selected');
            }
        }

        
    }

    ComponentsContainer.registerComponent('SelectFilter', SelectFilter);
}  