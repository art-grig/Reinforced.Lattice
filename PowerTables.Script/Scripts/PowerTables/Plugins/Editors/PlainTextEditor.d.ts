declare module PowerTables.Plugins.Editors {
    class PlainTextEditor extends CellEditorBase<PowerTables.Editors.PlainText.IPlainTextEditorUiConfig> {
        Input: HTMLInputElement;
        ValidationRegex: RegExp;
        private _removeSeparators;
        private _dotSeparators;
        private _floatRegex;
        private _formatFunction;
        private _parseFunction;
        getValue(errors: IValidationMessage[]): any;
        setValue(value: any): void;
        init(masterTable: IMasterTable): void;
        private defaultParse(value, column, errors);
        private defaultFormat(value, column);
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        focus(): void;
    }
}
