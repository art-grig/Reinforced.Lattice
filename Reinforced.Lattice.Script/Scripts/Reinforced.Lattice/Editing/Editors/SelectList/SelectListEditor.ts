module Reinforced.Lattice.Editing.Editors.SelectList {

    export class SelectListEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.SelectList.ISelectListEditorUiConfig> {
        List: HTMLSelectElement;
        Items: Reinforced.Lattice.IUiListItem[];
        SelectedItem: Reinforced.Lattice.IUiListItem;

        public getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]): any {
            var selectedOption = this.List.options.item(this.List.selectedIndex);
            var item = selectedOption == null ? '' : <string>(<any>selectedOption).value.toString();
            var value = null;
            if (item.length === 0) {
                if (this.Column.IsString && this.Configuration.AllowEmptyString) value = item;
                else {
                    if (this.Column.Configuration.IsNullable) value = null;
                    else {
                        errors.push({ Code: 'NULLVALUE' });
                    }
                }
            } else {

                if (this.Column.IsEnum || this.Column.IsInteger) value = parseInt(item);
                else if (this.Column.IsFloat) value = parseFloat(item);
                else if (this.Column.IsBoolean) value = item.toUpperCase() === 'TRUE';
                else if (this.Column.IsDateTime) value = this.MasterTable.Date.parse(item);
                else if (this.Column.IsString) value = item.toString();
                else errors.push({ Code: 'UNKNOWN' });
            }

            return value;
        }

        public setValue(value: any): void {
            if (!this.List) return;
            var strvalue = this.Column.IsDateTime ? this.MasterTable.Date.serialize(value) : (value == null ? null : value.toString());
            var isSet = false;
            for (var i = 0; i < this.List.options.length; i++) {
                if ((<any>this.List.options.item(i)).value === strvalue) {
                    (<any>this.List.options.item(i)).selected = true;
                    isSet = true;
                }
            }
            if (this.IsInitialValueSetting) {
                if ((!isSet) &&
                    this.Configuration.MissingKeyFunction != null &&
                    this.Configuration.MissingValueFunction != null) {
                    strvalue = this.Configuration.MissingKeyFunction(this.DataObject);
                    if (strvalue != null) {
                        strvalue = strvalue.toString();
                        var text = this.Configuration.MissingValueFunction(this.DataObject).toString();
                        var e = document.createElement('option');
                        e.value = strvalue;
                        e.text = text;
                        e.selected = true;
                        this.List.add(e);
                    }
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

        public onStateChange(e: Reinforced.Lattice.Rendering.IStateChangedEvent) {
            if (e.State !== 'selected' && e.State !== 'saving') {
                this.VisualStates.mixinState('selected');
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.Items = this.Configuration.SelectListItems;
            if (this.Configuration.AddEmptyElement) {
                var empty = <Reinforced.Lattice.IUiListItem>{
                    Text: this.Configuration.EmptyElementText,
                    Value: '',
                    Disabled: false,
                    Selected: false
                };
                this.Items = [empty].concat(this.Items);
            }
        }

        public renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        public onAfterRender(e: HTMLElement): void {
            if (this.VisualStates) {
                this.VisualStates.subscribeStateChange(this.onStateChange.bind(this));
            }
        }

        public changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void {
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

        defineMessages(): { [key: string]: string } {
            return {
                'NULLVALUE': `Value must be provided for ${this.Column.Configuration.Title}`,
                'UNKNOWN': `Unknown value for ${this.Column.Configuration.Title}`
            }
        }
    }

    ComponentsContainer.registerComponent('SelectListEditor', SelectListEditor);
} 