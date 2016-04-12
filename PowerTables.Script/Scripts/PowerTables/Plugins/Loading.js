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
        var LoadingPlugin = (function (_super) {
            __extends(LoadingPlugin, _super);
            function LoadingPlugin() {
                _super.apply(this, arguments);
            }
            LoadingPlugin.prototype.subscribe = function (e) {
                var _this = this;
                e.BeforeLoading.subscribe(function () { return _this.showLoadingIndicator(); }, "loading");
                e.AfterLoading.subscribe(function () { return _this.hideLoadingIndicator(); }, "loading");
                e.AfterLayoutRendered.subscribe(function () {
                    var me = _this.MasterTable.Renderer.Locator.getPluginElement(_this);
                    _this._blinkElement = me.querySelector('[data-blink]');
                    _this.hideLoadingIndicator();
                }, 'loading');
            };
            LoadingPlugin.prototype.showLoadingIndicator = function () {
                this._blinkElement.style.visibility = 'visible';
            };
            LoadingPlugin.prototype.hideLoadingIndicator = function () {
                this._blinkElement.style.visibility = 'collapse';
            };
            LoadingPlugin.prototype.renderContent = function (templatesProvider) {
                return templatesProvider.getCachedTemplate('loading')(null);
            };
            LoadingPlugin.Id = 'Loading';
            return LoadingPlugin;
        })(Plugins.PluginBase);
        Plugins.LoadingPlugin = LoadingPlugin;
        PowerTables.ComponentsContainer.registerComponent('Loading', LoadingPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Loading.js.map