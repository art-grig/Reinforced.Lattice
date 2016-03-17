var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var LimitPlugin = (function (_super) {
        __extends(LimitPlugin, _super);
        function LimitPlugin() {
            _super.call(this, 'pt-plugin-limit');
            this.IsToolbarPlugin = true;
            this.PluginId = 'Limit';
            this.IsQueryModifier = true;
            this.IsRenderable = true;
        }
        LimitPlugin.prototype.init = function (table, configuration) {
            var s = [];
            var conf = configuration.Configuration;
            var def = null;
            for (var i = 0; i < conf.LimitValues.length; i++) {
                var a = {
                    Value: conf.LimitValues[i],
                    Label: conf.LimitLabels[i],
                    Separator: conf.LimitLabels[i] === '-'
                };
                s.push(a);
                if (a.Label === conf.DefaultValue) {
                    def = a;
                }
            }
            this.Sizes = s;
            this._table = table;
            if (def) {
                this.DefaultLabel = def.Label;
                this.DefaultValue = def.Value;
                this._pageSize = def.Value;
            }
            else {
                this._pageSize = 0;
            }
            this._configuration = conf;
            table.Events.AfterFilterGathering.subscribe(this.addLimits.bind(this), 'limit');
        };
        LimitPlugin.prototype.addLimits = function (query) {
            query.Paging.PageSize = this._pageSize;
        };
        LimitPlugin.prototype.handleLimitSelect = function (item) {
            var itm = $(item);
            var value = itm.data('size');
            var changed = this._pageSize !== value;
            if (!changed)
                return;
            this._pageSize = value;
            var labelPair = null;
            for (var i = 0; i < this.Sizes.length; i++) {
                labelPair = this.Sizes[i];
                if (labelPair.Value === value) {
                    break;
                }
            }
            this._selectedLabelElement.text(labelPair.Label);
            if (this._configuration.ReloadTableOnLimitChange)
                this._table.reload();
        };
        LimitPlugin.prototype.subscribeEvents = function (parentElement) {
            var _self = this;
            parentElement.find('._limitSelect').click(function (e) {
                _self.handleLimitSelect(this);
            });
            this._selectedLabelElement = parentElement.find('._selectedLabel');
        };
        LimitPlugin.prototype.modifyQuery = function (query) {
            query.Paging.PageSize = this._pageSize;
        };
        return LimitPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.LimitPlugin = LimitPlugin;
    PowerTables.ComponentsContainer.registerComponent('Limit', LimitPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Limit.js.map