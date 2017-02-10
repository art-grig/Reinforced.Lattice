module PowerTables.Plugins.ResponseInfo {
    export class ResponseInfoPlugin extends PluginBase<Plugins.ResponseInfo.IResponseInfoClientConfiguration>
        implements PowerTables.IAdditionalDataReceiver
    {
        private _recentData: any = {};
        private _recentServerData: any;
        private _recentTemplate: string;
        private _pagingEnabled: boolean;
        private _pagingPlugin: IPagingPlugin;
        private _isServerRequest: boolean;
        private _isReadyForRendering: boolean = false;

        public onResponse(e: ITableEventArgs<IDataEventArgs>) {
            this._isServerRequest = true;
            if (!this.Configuration.ResponseObjectOverriden) {
                this._recentServerData = this.MasterTable.Stats;
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
            this._recentData = this.MasterTable.Stats;
            this.addClientData(e.EventArgs);

            this._isServerRequest = false;
            this._isReadyForRendering = true;
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            if (!this._isReadyForRendering) return;
            if (this.Configuration.ClientTemplateFunction) {
                p.w(this.Configuration.ClientTemplateFunction(this._recentData));
            } else {
                p.nest(this._recentData,this._recentTemplate);
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);

            this._recentTemplate = this.RawConfig.TemplateId;
            if (this.Configuration.ResponseObjectOverriden) {
                this.MasterTable.Loader.registerAdditionalDataReceiver('ResponseInfo', this);
            }
            this.MasterTable.Events.ClientDataProcessing.subscribeAfter(this.onClientDataProcessed.bind(this), 'responseInfo');
            this.MasterTable.Events.DataReceived.subscribeBefore(this.onResponse.bind(this), 'responseInfo');
            try {
                this._pagingPlugin = <IPagingPlugin>this.MasterTable.InstanceManager.getPlugin('Paging');
                this._pagingEnabled = true;
            } catch (v) {
                this._pagingEnabled = false;
            }

        }

        handleAdditionalData(additionalData): void {
            this._recentData = additionalData;
            this._isReadyForRendering = true;
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }
    }

    ComponentsContainer.registerComponent('ResponseInfo', ResponseInfoPlugin);
}