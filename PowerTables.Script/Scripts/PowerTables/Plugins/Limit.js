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
        var LimitPlugin = (function (_super) {
            __extends(LimitPlugin, _super);
            function LimitPlugin() {
                _super.apply(this, arguments);
                this._limitSize = 0;
                this.Sizes = [];
            }
            LimitPlugin.prototype.renderContent = function (templatesProvider) {
                return templatesProvider.getCachedTemplate('limit')(this);
            };
            LimitPlugin.prototype.changeLimitHandler = function (e) {
                var limit = parseInt(e.EventArguments[0]);
                if (isNaN(limit))
                    limit = 0;
                this.changeLimit(limit);
            };
            LimitPlugin.prototype.changeLimit = function (limit) {
                var changed = this._limitSize !== limit;
                if (!changed)
                    return;
                this._limitSize = limit;
                var labelPair = null;
                for (var i = 0; i < this.Sizes.length; i++) {
                    labelPair = this.Sizes[i];
                    if (labelPair.Value === limit) {
                        break;
                    }
                }
                if (labelPair != null)
                    this.SelectedValue = labelPair.Label;
                this.MasterTable.Renderer.redrawPlugin(this);
                if (this.Configuration.ReloadTableOnLimitChange)
                    this.MasterTable.Controller.reload();
            };
            LimitPlugin.prototype.modifyQuery = function (query, scope) {
                var client = this.Configuration.EnableClientLimiting;
                if (client && (scope === PowerTables.QueryScope.Client || scope === PowerTables.QueryScope.Transboundary)) {
                    query.Paging.PageSize = this._limitSize;
                }
                if (!client && (scope === PowerTables.QueryScope.Server || scope === PowerTables.QueryScope.Transboundary)) {
                    query.Paging.PageSize = this._limitSize;
                }
            };
            LimitPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                var def = null;
                for (var i = 0; i < this.Configuration.LimitValues.length; i++) {
                    var a = {
                        Value: this.Configuration.LimitValues[i],
                        Label: this.Configuration.LimitLabels[i],
                        IsSeparator: this.Configuration.LimitLabels[i] === '-'
                    };
                    this.Sizes.push(a);
                    if (a.Label === this.Configuration.DefaultValue) {
                        def = a;
                    }
                }
                if (def) {
                    this.SelectedValue = def.Label;
                    this._limitSize = def.Value;
                }
                else {
                    this._limitSize = 0;
                }
                if (this.Configuration.EnableClientLimiting) {
                    this.MasterTable.DataHolder.EnableClientTake = true;
                }
                this.MasterTable.Events.ColumnsCreation.subscribe(this.onColumnsCreation.bind(this), 'paging');
            };
            LimitPlugin.prototype.onColumnsCreation = function () {
                if (this.Configuration.EnableClientLimiting && !this.MasterTable.DataHolder.EnableClientSkip) {
                    var paging = null;
                    try {
                        paging = this.MasterTable.InstanceManager.getPlugin('Paging');
                    }
                    catch (a) { }
                    if (paging != null)
                        throw new Error('Limit ang paging plugin must both work locally or both remote. Please enable client paging');
                }
            };
            return LimitPlugin;
        })(Plugins.FilterBase);
        Plugins.LimitPlugin = LimitPlugin;
        PowerTables.ComponentsContainer.registerComponent('Limit', LimitPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Limit.js.map