var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var HideoutPlugin = (function (_super) {
        __extends(HideoutPlugin, _super);
        function HideoutPlugin() {
            _super.call(this, 'pt-hideout');
            this.ColumnsStates = [];
            this.IsToolbarPlugin = true;
            this.PluginId = 'Hideout';
            this.IsRenderable = true;
            this.IsQueryModifier = false;
            this._visibleColumn = Handlebars.compile($('#pt-hideout-visibleColumn').html());
            this._hiddenColumn = Handlebars.compile($('#pt-hideout-hiddenColumn').html());
        }
        HideoutPlugin.prototype.init = function (table, configuration) {
            this._masterTable = table;
            this._configuration = (configuration.Configuration);
            if (!this._configuration || !this._configuration.ShowMenu) {
                this.IsRenderable = false;
            }
            else {
                this.IsRenderable = true;
                this.constructColumnStates();
            }
            this._masterTable.Events.AfterColumnHeaderRender.subscribe(this.onHeaderDrawn.bind(this), 'hideout');
            this._masterTable.Events.AfterFilterRender.subscribe(this.onFilterDrawn.bind(this), 'hideout');
            this._masterTable.Events.AfterCellDraw.subscribe(this.onCellDrawn.bind(this), 'hideout');
        };
        HideoutPlugin.prototype.constructColumnStates = function () {
            var cols = this._masterTable.Configuration.Columns;
            for (var ck in cols) {
                if (cols.hasOwnProperty(ck)) {
                    var col = cols[ck];
                    if (this._configuration.HidebleColumnsNames.indexOf(col.RawColumnName) === -1)
                        continue;
                    var hc = col.CellPluginsConfiguration['Hideout'];
                    this.ColumnsStates.push({
                        RawName: col.RawColumnName,
                        Name: col.Title,
                        Visible: !hc || !hc.Hidden
                    });
                }
            }
        };
        HideoutPlugin.prototype.onHeaderDrawn = function (column) {
            if (!this.isColumnInstanceVisible(column)) {
                column.HeaderElement.hide();
            }
        };
        HideoutPlugin.prototype.onFilterDrawn = function (column) {
            if (!this.isColumnInstanceVisible(column)) {
                column.Filter.Element.hide();
            }
        };
        HideoutPlugin.prototype.onCellDrawn = function (c) {
            if (!this.isColumnInstanceVisible(c.Column)) {
                c.Element.hide();
            }
        };
        HideoutPlugin.prototype.isColumnVisible = function (columnName) {
            return this.isColumnInstanceVisible(this._masterTable.Columns[columnName]);
        };
        HideoutPlugin.prototype.isColumnInstanceVisible = function (col) {
            if (!col)
                return true;
            var hc = col.Configuration.CellPluginsConfiguration['Hideout'];
            return !hc || !hc.Hidden;
        };
        HideoutPlugin.prototype.hideColumnByName = function (rawColname) {
            this.hideColumnInstance(this._masterTable.Columns[rawColname]);
        };
        HideoutPlugin.prototype.hideColumnInstance = function (c) {
            if (!c)
                return;
            c.HeaderElement.hide();
            c.Filter.Element.hide();
            for (var i = 0; i < c.Elements.length; i++) {
                c.Elements[i].hide();
            }
            if (!c.Configuration.CellPluginsConfiguration['Hideout']) {
                c.Configuration.CellPluginsConfiguration['Hideout'] = {};
            }
            c.Configuration.CellPluginsConfiguration['Hideout'].Hidden = true;
        };
        HideoutPlugin.prototype.showColumnByName = function (rawColname) {
            this.showColumnInstance(this._masterTable.Columns[rawColname]);
        };
        HideoutPlugin.prototype.showColumnInstance = function (c) {
            if (!c)
                return;
            c.HeaderElement.show();
            c.Filter.Element.show();
            for (var i = 0; i < c.Elements.length; i++) {
                c.Elements[i].show();
            }
            if (!c.Configuration.CellPluginsConfiguration['Hideout']) {
                c.Configuration.CellPluginsConfiguration['Hideout'] = {};
            }
            c.Configuration.CellPluginsConfiguration['Hideout'].Hidden = false;
        };
        HideoutPlugin.prototype.toggleColumnByName = function (columnName) {
            if (this.isColumnVisible(columnName)) {
                this.hideColumnByName(columnName);
                return false;
            }
            else {
                this.showColumnByName(columnName);
                return true;
            }
        };
        HideoutPlugin.prototype.subscribeEvents = function (parentElement) {
            var _self = this;
            parentElement.delegate('li[data-showhide]', 'click', function (e) {
                var li = $(this);
                var name = li.data('showhide');
                var shown = _self.toggleColumnByName(name);
                var colName = _self._masterTable.Columns[name].Configuration.Title;
                if (!shown) {
                    li.html(_self._hiddenColumn({ Name: colName }));
                }
                else {
                    li.html(_self._visibleColumn({ Name: colName }));
                }
                e.stopPropagation(); // to disable menu hide
            });
        };
        return HideoutPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.HideoutPlugin = HideoutPlugin;
    PowerTables.ComponentsContainer.registerComponent('Hideout', HideoutPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Hideout.js.map