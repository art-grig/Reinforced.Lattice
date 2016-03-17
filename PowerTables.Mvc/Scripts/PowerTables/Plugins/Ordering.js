var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var OrderingPlugin = (function (_super) {
        __extends(OrderingPlugin, _super);
        function OrderingPlugin() {
            _super.call(this, null);
            this._cellsOrderings = {};
            this.IsToolbarPlugin = false;
            this.PluginId = 'Ordering';
            this.IsRenderable = false;
            this.IsQueryModifier = true;
            this.RenderingTemplate = Handlebars.compile($('#pt-ordering').html());
        }
        OrderingPlugin.prototype.init = function (table, configuration) {
            this._masterTable = table;
            this._masterTable.Events.AfterColumnHeaderRender.subscribe(this.onHeaderRender.bind(this), 'ordering');
        };
        OrderingPlugin.prototype.onHeaderRender = function (c) {
            var _this = this;
            if (!c.Configuration.CellPluginsConfiguration['Ordering'])
                return;
            var oc = (c.Configuration.CellPluginsConfiguration['Ordering']);
            this._cellsOrderings[c.RawName] = oc.DefaultOrdering;
            this.updateCellOrdering(c);
            c.HeaderElement.click(function (e) { return _this.changeOrdering(c); });
        };
        OrderingPlugin.prototype.changeOrdering = function (c) {
            var currentOrdering = this._cellsOrderings[c.RawName];
            if (currentOrdering === PowerTables.Ordering.Neutral)
                this._cellsOrderings[c.RawName] = PowerTables.Ordering.Ascending;
            if (currentOrdering === PowerTables.Ordering.Ascending)
                this._cellsOrderings[c.RawName] = PowerTables.Ordering.Descending;
            if (currentOrdering === PowerTables.Ordering.Descending)
                this._cellsOrderings[c.RawName] = PowerTables.Ordering.Neutral;
            this.updateCellOrdering(c);
            this._masterTable.reload();
        };
        OrderingPlugin.prototype.updateCellOrdering = function (c) {
            var cell = c.HeaderElement;
            cell.css('cursor', 'pointer');
            cell.empty();
            var ordering = this._cellsOrderings[c.RawName];
            cell.html(this.RenderingTemplate(this.createOrderingModel(ordering, c)));
        };
        OrderingPlugin.prototype.createOrderingModel = function (sortType, c) {
            return {
                Title: c.Configuration.Title,
                Type: sortType,
                IsAscending: function () {
                    return this.Type === PowerTables.Ordering.Ascending;
                },
                IsDescending: function () {
                    return this.Type === PowerTables.Ordering.Descending;
                },
                IsNeutral: function () {
                    return this.Type === PowerTables.Ordering.Neutral;
                }
            };
        };
        OrderingPlugin.prototype.modifyQuery = function (query) {
            query.Orderings = this._cellsOrderings;
        };
        return OrderingPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.OrderingPlugin = OrderingPlugin;
    PowerTables.ComponentsContainer.registerComponent('Ordering', OrderingPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Ordering.js.map