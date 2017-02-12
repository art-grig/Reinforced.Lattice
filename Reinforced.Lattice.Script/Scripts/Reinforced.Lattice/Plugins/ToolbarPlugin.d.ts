declare module PowerTables.Plugins {
    class ToolbarPlugin extends PluginBase<Plugins.Toolbar.IToolbarButtonsClientConfiguration> {
        AllButtons: {
            [id: number]: HTMLElement;
        };
        private _buttonsConfig;
        buttonHandleEvent(e: Rendering.ITemplateBoundEvent): void;
        private redrawMe();
        private handleButtonAction(btn);
        renderContent(templatesProvider: ITemplatesProvider): string;
        private traverseButtons(arr);
        private onSelectionChanged(e);
        init(masterTable: IMasterTable): void;
    }
}
