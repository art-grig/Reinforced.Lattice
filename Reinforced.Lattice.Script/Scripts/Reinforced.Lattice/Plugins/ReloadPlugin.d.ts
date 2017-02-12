declare module PowerTables {
    class ReloadPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.Reload.IReloadUiConfiguration> {
        private _renderedExternally;
        private _externalReloadBtn;
        private _ready;
        triggerReload(): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        startLoading(): void;
        stopLoading(): void;
        subscribe(e: EventsManager): void;
        init(masterTable: IMasterTable): void;
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
