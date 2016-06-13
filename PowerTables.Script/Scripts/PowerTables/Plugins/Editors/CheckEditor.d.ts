declare module PowerTables.Plugins.Editors {
    class CheckEditor extends CellEditorBase<PowerTables.Editors.Check.ICheckEditorUiConfig> {
        FocusElement: HTMLElement;
        private _value;
        renderContent(templatesProvider: ITemplatesProvider): string;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        private updateState();
        getValue(errors: PowerTables.Plugins.IValidationMessage[]): any;
        setValue(value: any): void;
        focus(): void;
    }
}
