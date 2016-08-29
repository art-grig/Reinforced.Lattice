module PowerTables.Editing.Editors.SelectList {

    export class SelectListEditor extends PowerTables.Editing.EditorBase<PowerTables.Editing.Editors.SelectList.ISelectListEditorUiConfig> {
        List: HTMLSelectElement;
        Items: System.Web.Mvc.ISelectListItem[];
        SelectedItem: System.Web.Mvc.ISelectListItem;

        public getValue(errors: PowerTables.Editing.IValidationMessage[]): any {
            var selectedOption = this.List.options.item(this.List.selectedIndex);
            var item = <string>(<any>selectedOption).value.toString();
            var value = null;
            if (item.length === 0) {
                if (this.Column.IsString && this.Configuration.AllowEmptyString) value = item;
                if (this.Column.Configuration.IsNullable) value = null;
                else {
                    errors.push({ Code: 'NULLVALUE', Message: `Value must be provided for ${this.Column.Configuration.Title}` });
                }
            } else {

                if (this.Column.IsEnum || this.Column.IsInteger) value = parseInt(item);
                else if (this.Column.IsFloat) value = parseFloat(item);
                else if (this.Column.IsBoolean) value = item.toUpperCase() === 'TRUE';
                else if (this.Column.IsDateTime) value = this.MasterTable.Date.parse(item);
                else errors.push({ Code: 'UNKNOWN', Message: `Unknown value for ${this.Column.Configuration.Title}` });
            }

            return value;
        }

        public setValue(value: any): void {
            var strvalue = this.Column.IsDateTime ? this.MasterTable.Date.serialize(value) : (value == null ? null : value.toString());
            for (var i = 0; i < this.List.options.length; i++) {
                if ((<any>this.List.options.item(i)).value === strvalue) {
                    (<any>this.List.options.item(i)).selected = true;
                }
            }
            for (var i = 0; i < this.Items.length; i++) {
                if (this.Items[i].Value == strvalue) {
                    this.SelectedItem = this.Items[i];
                    break;
                }
            }
            this.VisualStates.mixinState('selected');
        }

        public onStateChange(e: PowerTables.Rendering.IStateChangedEvent) {
            if (e.State !== 'selected' && e.State !== 'saving') {
                this.VisualStates.mixinState('selected');
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.Items = this.Configuration.SelectListItems;
            if (this.Configuration.AddEmptyElement) {
                var empty = <System.Web.Mvc.ISelectListItem>{
                    Text: this.Configuration.EmptyElementText,
                    Value: '',
                    Disabled: false,
                    Selected: false
                };
                this.Items = [empty].concat(this.Items);
            }
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
        }

        public onAfterRender(e: HTMLElement): void {
            if (this.VisualStates) {
                this.VisualStates.subscribeStateChange(this.onStateChange.bind(this));
            }
        }

        public changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void {
            super.changedHandler(e);
            var item = (<any>this.List.options.item(this.List.selectedIndex)).value;
            for (var i = 0; i < this.Items.length; i++) {
                if (this.Items[i].Value == item) {
                    this.SelectedItem = this.Items[i];
                    break;
                }
            }
            this.VisualStates.mixinState('selected');

        }

        public focus(): void {
            this.List.focus();
        }
    }

    ComponentsContainer.registerComponent('SelectListEditor', SelectListEditor);
} 