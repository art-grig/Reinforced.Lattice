module PowerTables.Plugins {
    import ResponseInfoClientConfiguration = Plugins.ResponseInfo.IResponseInfoClientConfiguration;

    export class ResponseInfoPlugin extends PluginBase<ResponseInfoClientConfiguration> {
        private _recentData: any;
        private _recentServerData: any;
        private _recentTemplate: HandlebarsTemplateDelegate;
        private _pagingEnabled: boolean;
        private _pagingPlugin: IPagingPlugin;
        private _isServerRequest: boolean;
        private _isReadyForRendering: boolean = false;

        public onResponse(e: ITableEventArgs<IDataEventArgs>) {
            this._isServerRequest = true;
            if (this.Configuration.ResponseObjectOverriden) {
                this._recentData = e.EventArgs.Data.AdditionalData['ResponseInfo'];
                this._isReadyForRendering = true;
                this.MasterTable.Renderer.Modifier.redrawPlugin(this);
            } else {
                this._recentServerData = {
                    TotalCount: e.EventArgs.Data.ResultsCount,
                    IsLocalRequest: false,
                    CurrentPage: e.EventArgs.Data.PageIndex,
                    PagingEnabled: this._pagingEnabled
                };
            }
        }

        public onClientDataProcessed(e: ITableEventArgs<IClientDataResults>) {
            if (this.Configuration.ResponseObjectOverriden) return;

            if (!this.Configuration.ClientEvaluationFunction) {
                this._recentData = {
                    TotalCount: this._recentServerData.TotalCount || this.MasterTable.DataHolder.StoredData.length,
                    IsLocalRequest: !this._isServerRequest,
                    CurrentPage: this._recentServerData.CurrentPage || ((!this._pagingPlugin) ? 0 : this._pagingPlugin.getCurrentPage() + 1),
                    TotalPages: ((!this._pagingPlugin) ? 0 : this._pagingPlugin.getTotalPages()),
                    PagingEnabled: this._pagingEnabled,
                    CurrentlyShown: this.MasterTable.DataHolder.DisplayedData.length
                };
            } else {
                this._recentData = this.Configuration.ClientEvaluationFunction(
                    e.EventArgs,
                    (!this._pagingPlugin) ? 0 : (this._pagingPlugin.getCurrentPage()),
                    (!this._pagingPlugin) ? 0 : (this._pagingPlugin.getTotalPages())
                );
            }
            this._isServerRequest = false;
            this._isReadyForRendering = true;
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            if (!this._isReadyForRendering) return '';
            if (this.Configuration.ClientTemplateFunction) {
                return this.Configuration.ClientTemplateFunction(this._recentData);
            } else {
                return this._recentTemplate(this._recentData);
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.TemplateText && this.Configuration.TemplateText.length > 0) {
                this._recentTemplate = this.MasterTable.Renderer.HandlebarsInstance.compile(this.Configuration.TemplateText);
            } else {
                this._recentTemplate = this.MasterTable.Renderer.getCachedTemplate('responseInfo');
            }
            this.MasterTable.Events.AfterClientDataProcessing.subscribe(this.onClientDataProcessed.bind(this), 'responseInfo');
            this.MasterTable.Events.DataReceived.subscribe(this.onResponse.bind(this), 'responseInfo');
            try {
                this._pagingPlugin = <IPagingPlugin>this.MasterTable.InstanceManager.getPlugin('Paging');
                this._pagingEnabled = true;
            } catch (v) {
                this._pagingEnabled = false;
            }

        }
    }

    ComponentsContainer.registerComponent('ResponseInfo', ResponseInfoPlugin);
}