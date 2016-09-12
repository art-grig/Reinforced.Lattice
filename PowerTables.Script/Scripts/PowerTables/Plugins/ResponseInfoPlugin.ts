module PowerTables.Plugins.ResponseInfo {
    export class ResponseInfoPlugin extends PluginBase<Plugins.ResponseInfo.IResponseInfoClientConfiguration> {
        private _recentData: any = {};
        private _recentServerData: any;
        private _recentTemplate: HandlebarsTemplateDelegate;
        private _pagingEnabled: boolean;
        private _pagingPlugin: IPagingPlugin;
        private _isServerRequest: boolean;
        private _isReadyForRendering: boolean = false;

        public onResponse(e: ITableEventArgs<IDataEventArgs>) {
            this._isServerRequest = true;
            if (this.Configuration.ResponseObjectOverriden) {
                if (!e.EventArgs.Data.AdditionalData) return;
                if (!e.EventArgs.Data.AdditionalData['ResponseInfo']) return;

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

        private addClientData(e: IClientDataResults) {
            for (var k in this.Configuration.ClientCalculators) {
                if (this.Configuration.ClientCalculators.hasOwnProperty(k)) {
                    this._recentData[k] = this.Configuration.ClientCalculators[k](e);
                }
            }
        }

        public onClientDataProcessed(e: ITableEventArgs<IClientDataResults>) {
            
            if (this.Configuration.ResponseObjectOverriden) {
                this.addClientData(e.EventArgs);
                this.MasterTable.Renderer.Modifier.redrawPlugin(this);
                return;
            }
            this._recentData = {
                TotalCount: this._recentServerData.TotalCount || this.MasterTable.DataHolder.StoredData.length,
                IsLocalRequest: !this._isServerRequest,
                CurrentPage: this._recentServerData.CurrentPage || ((!this._pagingPlugin) ? 0 : this._pagingPlugin.getCurrentPage() + 1),
                TotalPages: ((!this._pagingPlugin) ? 0 : this._pagingPlugin.getTotalPages()),
                PagingEnabled: this._pagingEnabled
            };
            this.addClientData(e.EventArgs);

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

            this._recentTemplate = this.MasterTable.Renderer.getCachedTemplate(this.RawConfig.TemplateId);

            this.MasterTable.Events.ClientDataProcessing.subscribeAfter(this.onClientDataProcessed.bind(this), 'responseInfo');
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