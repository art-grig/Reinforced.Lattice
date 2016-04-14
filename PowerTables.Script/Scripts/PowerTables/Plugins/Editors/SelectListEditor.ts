module PowerTables.Plugins.Editors {
    import SelectListEditorUiConfig = PowerTables.Editors.SelectList.ISelectListEditorUiConfig;
    import SelectListItem = System.Web.Mvc.ISelectListItem;

    export class SelectListEditor extends CellEditorBase<SelectListEditorUiConfig> {
        Select: HTMLSelectElement;
        Items: SelectListItem[];

        public getValue(errors: string[]): any {
            var item = <string>this.Select.options.item(this.Select.selectedIndex).value.toString();
            if (item.length === 0) {
                if (this.Column.IsString && this.Configuration.AllowEmptyString) return item;
                if (this.Column.Configuration.IsNullable) return null;
                errors.push(`Value must be provided for ${this.Column.Configuration.Title}`);
                return null;
            }
            
            if (this.Column.IsEnum || this.Column.IsInteger) return parseInt(item);
            if (this.Column.IsFloat) return parseFloat(item);
            if (this.Column.IsBoolean) return item.toUpperCase() === 'TRUE';
            if (this.Column.IsDateTime) return this.MasterTable.Date.parse(item);
            errors.push(`Unknown value for ${this.Column.Configuration.Title}`);
            return null;
        }

        public setValue(value: any): void {
            var strvalue = this.Column.IsDateTime ? this.MasterTable.Date.serialize(value) : value.toString();
            for (var i = 0; i < this.Select.options.length; i++) {
                if (this.Select.options.item(i).value === strvalue) {
                    this.Select.options.item(i).selected = true;
                }
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.Items = this.Configuration.SelectListItems;
        }
    }

    ComponentsContainer.registerComponent('SelectListEditor', SelectListEditor);
} 