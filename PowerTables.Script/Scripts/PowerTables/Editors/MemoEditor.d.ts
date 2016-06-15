declare module PowerTables.Plugins.Editors {
    class MemoEditor extends CellEditorBase<PowerTables.Editors.Memo.IMemoEditorUiConfig> {
        TextArea: HTMLInputElement;
        MaxChars: number;
        CurrentChars: number;
        Rows: number;
        WarningChars: number;
        Columns: number;
        init(masterTable: IMasterTable): void;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        setValue(value: any): void;
        getValue(errors: PowerTables.Plugins.IValidationMessage[]): any;
        renderContent(templatesProvider: ITemplatesProvider): string;
        focus(): void;
    }
}
