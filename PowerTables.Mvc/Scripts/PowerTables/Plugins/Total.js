var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var TotalPlugin = (function (_super) {
        __extends(TotalPlugin, _super);
        function TotalPlugin() {
            _super.call(this, null);
            this.IsToolbarPlugin = false;
            this.PluginId = 'Total';
            this.IsRenderable = false;
            this.IsQueryModifier = false;
        }
        TotalPlugin.prototype.init = function (table, configuration) {
            this._masterTable = table;
            this._configuration = configuration.Configuration;
            if (this._configuration.ShowOnTop) {
                table.Events.BeforeResponseDrawing.subscribe(this.onResponse.bind(this), 'total');
            }
            else {
                table.Events.ResponseDrawing.subscribe(this.onResponse.bind(this), 'total');
            }
        };
        TotalPlugin.prototype.onResponse = function (response) {
            var total = response.AdditionalData['Total'];
            if (total) {
                var cols = this._masterTable.Columns;
                var rowElement = $("<" + this._masterTable.Configuration.DefaultRowElement + "></" + this._masterTable.Configuration.DefaultRowElement + ">");
                var row = {
                    MasterTable: this._masterTable,
                    DataObject: null,
                    Index: 0,
                    Elements: [],
                    Element: rowElement,
                    Fake: true
                };
                this.TotalRow = rowElement;
                var columnsOrder = this._masterTable.getColumnNames();
                this._masterTable.Events.BeforeRowDraw.invoke(this, [row]);
                for (var j = 0; j < columnsOrder.length; j++) {
                    var kk = columnsOrder[j];
                    var column = this._masterTable.Columns[kk];
                    var cell = {
                        Column: column,
                        Data: null,
                        DataObject: null,
                        Row: row,
                        Element: null,
                        Fake: true
                    };
                    this._masterTable.Events.BeforeCellDraw.invoke(this, [cell]);
                    var element = null;
                    if (!total.TotalsForColumns[column.RawName])
                        element = this._masterTable.Renderer.renderRawCell('');
                    else {
                        var value = total.TotalsForColumns[column.RawName];
                        if (this._configuration.ColumnsValueFunctions[column.RawName]) {
                            value = this._configuration.ColumnsValueFunctions[column.RawName](value);
                        }
                        value = "<strong>" + value + "</strong>";
                        element = this._masterTable.Renderer.renderRawCell(value);
                    }
                    cell.Element = element;
                    column.Elements.push(element);
                    row.Elements.push(element);
                    this._masterTable.Events.AfterCellDraw.invoke(this, [cell]);
                    rowElement = rowElement.append(element);
                }
                this._masterTable.Renderer.appendRow(rowElement);
                this._masterTable.Events.AfterRowDraw.invoke(this, [row]);
            }
        };
        return TotalPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.TotalPlugin = TotalPlugin;
    PowerTables.ComponentsContainer.registerComponent('Total', TotalPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Total.js.map