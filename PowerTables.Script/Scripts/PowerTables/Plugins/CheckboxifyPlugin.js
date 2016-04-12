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
        var CheckboxifyPlugin = (function (_super) {
            __extends(CheckboxifyPlugin, _super);
            function CheckboxifyPlugin() {
                _super.apply(this, arguments);
                this._selectedItems = [];
                this._visibleAll = false;
                this._allSelected = false;
            }
            CheckboxifyPlugin.prototype.selectAll = function () {
                this._allSelected = !this._allSelected;
                this.MasterTable.Renderer.redrawHeader(this._ourColumn);
            };
            CheckboxifyPlugin.prototype.createColumn = function () {
                var _this = this;
                var conf = {
                    IsDataOnly: false,
                    IsEnum: false,
                    IsNullable: false,
                    RawColumnName: '_checkboxify',
                    CellRenderingTemplateId: null,
                    CellRenderingValueFunction: null,
                    Title: 'Checkboxify',
                    ColumnType: 'Int32'
                };
                var col = {
                    Configuration: conf,
                    Header: null,
                    IsBoolean: false,
                    IsDateTime: false,
                    IsEnum: false,
                    IsFloat: false,
                    IsInteger: false,
                    IsString: false,
                    MasterTable: this.MasterTable,
                    Order: -1,
                    RawName: '_checkboxify'
                };
                var header = {
                    Column: col,
                    renderContent: null,
                    renderElement: function (tp) { return tp.getCachedTemplate('checkboxifySelectAll')({ IsAllSelected: _this._allSelected }); },
                    selectAllEvent: function (e) { return _this.selectAll(); }
                };
                col.Header = header;
                this.MasterTable.Renderer.ContentRenderer.cacheColumnRenderingFunction(col, function (x) { return ''; });
                return col;
            };
            CheckboxifyPlugin.prototype.embedCheckboxCell = function (rows) {
            };
            CheckboxifyPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                var col = this.createColumn();
                this.MasterTable.InstanceManager.Columns['_checkboxify'] = col;
                this._ourColumn = col;
            };
            return CheckboxifyPlugin;
        })(Plugins.PluginBase);
        Plugins.CheckboxifyPlugin = CheckboxifyPlugin;
        PowerTables.ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=CheckboxifyPlugin.js.map