module PowerTables.Editors.Memo {
    
    export class MemoEditor extends PowerTables.Editing.EditorBase<PowerTables.Editing.Editors.Memo.IMemoEditorUiConfig>{
        TextArea: HTMLInputElement;

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
            this.CurrentChars = this.TextArea.value.length;
            if (this.WarningChars !== 0 && this.CurrentChars >= this.WarningChars && this.CurrentChars <= this.MaxChars) {
                this.VisualStates.mixinState('warning');
            } else {
                this.VisualStates.unmixinState('warning');
            }
            super.changedHandler(e);
        }

        public setValue(value: any): void {
            this.TextArea.value = value;
        }

        public getValue(errors: PowerTables.Editing.IValidationMessage[]): any {
            var value = this.TextArea.value;
            if (this.MaxChars > 0 && value.length > this.MaxChars) {
                errors.push({ Code: 'MAXCHARS', Message: `Maximum ${this.Column.Configuration.Title} length exceeded` });
                return null;
            }
            return value;
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
        }

        public focus(): void {
            this.TextArea.focus();
            this.TextArea.setSelectionRange(0, this.TextArea.value.length);
        }
    }

    ComponentsContainer.registerComponent('MemoEditor', MemoEditor);
} 