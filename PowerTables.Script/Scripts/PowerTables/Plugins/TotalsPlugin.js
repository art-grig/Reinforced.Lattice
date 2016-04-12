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
        var TotalsPlugin = (function (_super) {
            __extends(TotalsPlugin, _super);
            function TotalsPlugin() {
                _super.apply(this, arguments);
            }
            TotalsPlugin.prototype.makeTotalsRow = function () {
                var cols = this.MasterTable.InstanceManager.getUiColumns();
                var dataObject = {};
                for (var j = 0; j < cols.length; j++) {
                    var v = null;
                    var cl = cols[j];
                    if (this._totalsForColumns.hasOwnProperty(cl.RawName)) {
                        v = this._totalsForColumns[cl.RawName];
                        if (this.Configuration.ColumnsValueFunctions[cl.RawName]) {
                            v = this.Configuration.ColumnsValueFunctions[cl.RawName](v);
                        }
                    }
                    dataObject[cols[j].RawName] = v;
                }
                var result = {
                    Index: -1,
                    MasterTable: this.MasterTable,
                    DataObject: dataObject,
                    Cells: {},
                    renderContent: null,
                    renderElement: null,
                    IsSpecial: true
                };
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    var cell = {
                        DataObject: dataObject,
                        renderElement: null,
                        Column: cols[i],
                        Row: result,
                        Data: dataObject[col.RawName]
                    };
                    result.Cells[col.RawName] = cell;
                }
                return result;
            };
            TotalsPlugin.prototype.onResponse = function (e) {
                var response = e.EventArgs.Data;
                var total = response.AdditionalData['Total'];
                this._totalsForColumns = total.TotalsForColumns;
            };
            TotalsPlugin.prototype.onClientRowsRendering = function (e) {
                if (this._totalsForColumns) {
                    if (this.Configuration.ShowOnTop) {
                        e.EventArgs.splice(0, 0, this.makeTotalsRow());
                    }
                    else {
                        e.EventArgs.push(this.makeTotalsRow());
                    }
                }
            };
            TotalsPlugin.prototype.onClientDataProcessed = function (e) {
                if (!this._totalsForColumns)
                    this._totalsForColumns = {};
                for (var k in this.Configuration.ColumnsCalculatorFunctions) {
                    if (this.Configuration.ColumnsCalculatorFunctions.hasOwnProperty(k)) {
                        this._totalsForColumns[k] = this.Configuration.ColumnsCalculatorFunctions[k](e.EventArgs).toString();
                    }
                }
            };
            TotalsPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                this.MasterTable.Events.DataReceived.subscribe(this.onResponse.bind(this), 'totals');
                this.MasterTable.Events.BeforeClientRowsRendering.subscribe(this.onClientRowsRendering.bind(this), 'totals');
                this.MasterTable.Events.AfterClientDataProcessing.subscribe(this.onClientDataProcessed.bind(this), 'totals');
            };
            return TotalsPlugin;
        })(Plugins.PluginBase);
        Plugins.TotalsPlugin = TotalsPlugin;
        PowerTables.ComponentsContainer.registerComponent('Total', TotalsPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=TotalsPlugin.js.map