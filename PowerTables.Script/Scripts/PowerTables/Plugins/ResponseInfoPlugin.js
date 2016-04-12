var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var Plugins;
    (function (Plugins) {
        var ResponseInfoPlugin = (function (_super) {
            __extends(ResponseInfoPlugin, _super);
            function ResponseInfoPlugin() {
                _super.apply(this, arguments);
                this._isReadyForRendering = false;
            }
            ResponseInfoPlugin.prototype.onResponse = function (e) {
                this._isServerRequest = true;
                if (this.Configuration.ResponseObjectOverriden) {
                    this._recentData = e.EventArgs.Data.AdditionalData['ResponseInfo'];
                    this._isReadyForRendering = true;
                    this.MasterTable.Renderer.redrawPlugin(this);
                }
                else {
                    this._recentServerData = {
                        TotalCount: e.EventArgs.Data.ResultsCount,
                        IsLocalRequest: false,
                        CurrentPage: e.EventArgs.Data.PageIndex,
                        PagingEnabled: this._pagingEnabled
                    };
                }
            };
            ResponseInfoPlugin.prototype.onClientDataProcessed = function (e) {
                if (this.Configuration.ResponseObjectOverriden)
                    return;
                if (!this.Configuration.ClientEvaluationFunction) {
                    this._recentData = {
                        TotalCount: this._recentServerData.TotalCount || this.MasterTable.DataHolder.StoredData.length,
                        IsLocalRequest: !this._isServerRequest,
                        CurrentPage: this._recentServerData.CurrentPage || ((!this._pagingPlugin) ? 0 : this._pagingPlugin.getCurrentPage() + 1),
                        TotalPages: ((!this._pagingPlugin) ? 0 : this._pagingPlugin.getTotalPages()),
                        PagingEnabled: this._pagingEnabled,
                        CurrentlyShown: this.MasterTable.DataHolder.DisplayedData.length
                    };
                }
                else {
                    this._recentData = this.Configuration.ClientEvaluationFunction(e.EventArgs, (!this._pagingPlugin) ? 0 : (this._pagingPlugin.getCurrentPage()), (!this._pagingPlugin) ? 0 : (this._pagingPlugin.getTotalPages()));
                }
                this._isServerRequest = false;
                this._isReadyForRendering = true;
                this.MasterTable.Renderer.redrawPlugin(this);
            };
            ResponseInfoPlugin.prototype.renderContent = function (templatesProvider) {
                if (!this._isReadyForRendering)
                    return '';
                if (this.Configuration.ClientTemplateFunction) {
                    return this.Configuration.ClientTemplateFunction(this._recentData);
                }
                else {
                    return this._recentTemplate(this._recentData);
                }
            };
            ResponseInfoPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                if (this.Configuration.TemplateText && this.Configuration.TemplateText.length > 0) {
                    this._recentTemplate = this.MasterTable.Renderer.HandlebarsInstance.compile(this.Configuration.TemplateText);
                }
                else {
                    this._recentTemplate = this.MasterTable.Renderer.getCachedTemplate('responseInfo');
                }
                this.MasterTable.Events.AfterClientDataProcessing.subscribe(this.onClientDataProcessed.bind(this), 'responseInfo');
                this.MasterTable.Events.DataReceived.subscribe(this.onResponse.bind(this), 'responseInfo');
                try {
                    this._pagingPlugin = this.MasterTable.InstanceManager.getPlugin('Paging');
                    this._pagingEnabled = true;
                }
                catch (v) {
                    this._pagingEnabled = false;
                }
            };
            return ResponseInfoPlugin;
        })(Plugins.PluginBase);
        Plugins.ResponseInfoPlugin = ResponseInfoPlugin;
        PowerTables.ComponentsContainer.registerComponent('ResponseInfo', ResponseInfoPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=ResponseInfoPlugin.js.map