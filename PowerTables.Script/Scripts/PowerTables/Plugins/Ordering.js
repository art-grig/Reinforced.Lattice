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
        var Ordering;
        (function (Ordering) {
            var OrderingPlugin = (function (_super) {
                __extends(OrderingPlugin, _super);
                function OrderingPlugin() {
                    _super.apply(this, arguments);
                }
                OrderingPlugin.prototype.subscribe = function (e) {
                    var _this = this;
                    e.ColumnsCreation.subscribe(function (v) {
                        _this.overrideHeadersTemplates(v.EventArgs);
                    }, 'ordering');
                };
                OrderingPlugin.prototype.overrideHeadersTemplates = function (columns) {
                    var self = this;
                    var handler = function (et) {
                        self.switchOrderingForColumn(et.Column.RawName);
                    };
                    for (var ck in columns) {
                        if (columns.hasOwnProperty(ck)) {
                            var conf = this.Configuration.DefaultOrderingsForColumns[ck];
                            if (!conf)
                                continue;
                            var newHeader = {
                                Column: columns[ck]
                            };
                            newHeader.renderElement = function (tp) { return tp.getCachedTemplate('ordering')(newHeader); };
                            newHeader['switchOrdering'] = handler;
                            columns[ck].Header = newHeader;
                        }
                    }
                };
                OrderingPlugin.prototype.switchOrderingForColumn = function (columnName) {
                    if (!this.Configuration.DefaultOrderingsForColumns[columnName])
                        throw new Error("Ordering is not configured for column " + columnName);
                    alert('cell ordering switched!');
                };
                OrderingPlugin.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    // todo register client orderings
                };
                return OrderingPlugin;
            })(Plugins.FilterBase);
            Ordering.OrderingPlugin = OrderingPlugin;
            PowerTables.ComponentsContainer.registerComponent('Ordering', OrderingPlugin);
        })(Ordering = Plugins.Ordering || (Plugins.Ordering = {}));
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Ordering.js.map