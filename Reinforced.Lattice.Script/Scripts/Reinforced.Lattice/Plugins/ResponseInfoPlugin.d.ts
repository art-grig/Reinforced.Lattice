declare module PowerTables.Plugins {
    class ResponseInfoPlugin extends PluginBase<Plugins.ResponseInfo.IResponseInfoClientConfiguration> {
        private _recentData;
        private _recentServerData;
        private _recentTemplate;
        private _pagingEnabled;
        private _pagingPlugin;
        private _isServerRequest;
        private _isReadyForRendering;
        onResponse(e: ITableEventArgs<IDataEventArgs>): void;
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        init(masterTable: IMasterTable): void;
    }
}
