declare module PowerTables.Plugins.Editors {
    class SelectListEditor extends CellEditorBase<PowerTables.Editors.SelectList.ISelectListEditorUiConfig> {
        List: HTMLSelectElement;
        Items: System.Web.Mvc.ISelectListItem[];
        SelectedItem: System.Web.Mvc.ISelectListItem;
        getValue(errors: IValidationMessage[]): any;
        setValue(value: any): void;
        onStateChange(e: PowerTables.Rendering.IStateChangedEvent): void;
        init(masterTable: IMasterTable): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        onAfterRender(e: HTMLElement): void;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        focus(): void;
    }
}
