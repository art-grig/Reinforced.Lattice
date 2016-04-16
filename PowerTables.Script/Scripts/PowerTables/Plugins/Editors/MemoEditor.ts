module PowerTables.Plugins.Editors {
    import MemoEditorUiConfig = PowerTables.Editors.Memo.IMemoEditorUiConfig;

    export class MemoEditor extends CellEditorBase<MemoEditorUiConfig>{
        Input: HTMLInputElement;

        public MaxChars: number;
        public CurrentChars: number;
        public Rows: number;
        public WarningChars: number;
        public Columns: number;
        
        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MaxChars = this.Configuration.MaxChars;
            this.WarningChars = this.Configuration.WarningChars;
            this.Rows = this.Configuration.Rows;
            this.Columns = this.Configuration.Columns;
            this.CurrentChars = 0;
        }

        public changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void {
            this.CurrentChars = this.Input.value.length;
            if (this.WarningChars !== 0 && this.CurrentChars >= this.WarningChars && this.CurrentChars <= this.MaxChars) {
                this.VisualStates.mixinState('warning');
            } else {
                this.VisualStates.unmixinState('warning');
            }
            super.changedHandler(e);
        }

        public setValue(value: any): void {
            this.Input.value = value;
        }

        public getValue(errors: PowerTables.Plugins.IValidationMessage[]): any {
            var value = this.Input.value;
            if (value.length > this.MaxChars) {
                errors.push({ Code: 'MAXCHARS', Message: `Maximum ${this.Column.Configuration.Title} length exceeded` });
                return null;
            }
            return value;
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
        }
    }

    ComponentsContainer.registerComponent('MemoEditor', MemoEditor);
} 