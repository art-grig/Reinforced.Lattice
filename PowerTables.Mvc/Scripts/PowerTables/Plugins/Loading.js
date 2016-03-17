var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var LoadingPlugin = (function (_super) {
        __extends(LoadingPlugin, _super);
        function LoadingPlugin() {
            _super.call(this, 'pt-plugin-loading');
            this.IsToolbarPlugin = false;
            this.PluginId = 'Loading';
            this.IsRenderable = true;
            this.IsQueryModifier = false;
        }
        LoadingPlugin.prototype.init = function (table, configuration) {
            table.Events.BeforeLoading.subscribe(this.showLoading.bind(this), 'loading');
            table.Events.AfterLoading.subscribe(this.hideLoading.bind(this), 'loading');
        };
        LoadingPlugin.prototype.showLoading = function () {
            this._element.fadeIn(150);
        };
        LoadingPlugin.prototype.hideLoading = function () {
            this._element.fadeOut(150);
        };
        LoadingPlugin.prototype.subscribeEvents = function (parentElement) {
            this._element = parentElement.find('._loading');
            this._element.hide();
        };
        return LoadingPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.LoadingPlugin = LoadingPlugin;
    PowerTables.ComponentsContainer.registerComponent('Loading', LoadingPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Loading.js.map