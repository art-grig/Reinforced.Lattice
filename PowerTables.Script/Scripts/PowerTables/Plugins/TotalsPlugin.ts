module PowerTables.Plugins.Total {
    /**
     * Client-side implementation of totals plugin
     */
    export class TotalsPlugin extends PluginBase<Plugins.Total.ITotalClientConfiguration> {
        private _totalsForColumns: { [key: string]: string };

        private makeTotalsRow(): IRow {
            var cols: IColumn[] = this.MasterTable.InstanceManager.getUiColumns();
            var dataObject: {} = {};
            for (var j: number = 0; j < cols.length; j++) {
                var v: string = null;
                var cl: IColumn = cols[j];
                if (this._totalsForColumns.hasOwnProperty(cl.RawName)) {
                    v = this._totalsForColumns[cl.RawName];
                    if (this.Configuration.ColumnsValueFunctions[cl.RawName]) {
                        v = this.Configuration.ColumnsValueFunctions[cl.RawName](v);
                    }
                }
                dataObject[cols[j].RawName] = v;
            }

            var result: IRow = {
                Index: -1,
                MasterTable: this.MasterTable,
                DataObject: dataObject,
                Cells: {},
                renderContent: null,
                renderElement: null,
                IsSpecial: true
            };


            for (var i: number = 0; i < cols.length; i++) {
                var col: IColumn = cols[i];
                var cell: ICell = {
                    DataObject: dataObject,
                    renderElement: null,
                    renderContent: function (v) { return this.Data; },
                    Column: cols[i],
                    Row: result,
                    Data: dataObject[col.RawName]
                };
                result.Cells[col.RawName] = cell;
            }

            return result;
        }
/**
* @internal
*/
        public onResponse(e: ITableEventArgs<IDataEventArgs>) {
            if (!e.EventArgs.Data.AdditionalData) return;
            if (!e.EventArgs.Data.AdditionalData.hasOwnProperty('Total')) return;

            var response: IPowerTablesResponse = e.EventArgs.Data;
            var total: Plugins.Total.ITotalResponse = response.AdditionalData['Total'];
            this._totalsForColumns = total.TotalsForColumns;
        }
/**
* @internal
*/
        public onClientRowsRendering(e: ITableEventArgs<IRow[]>) {
            if (this._totalsForColumns) {
                if (this.Configuration.ShowOnTop) {
                    e.EventArgs.splice(0, 0, this.makeTotalsRow());
                } else {
                    e.EventArgs.push(this.makeTotalsRow());
                }
            }
        }
/**
* @internal
*/
        private onAdjustments(e: ITableEventArgs<IAdjustmentResult>) {
            var adjustments = e.EventArgs;
            if (adjustments.NeedRedrawAllVisible) return;
            var row = this.makeTotalsRow(); //todo recalculate totals in more intelligent way
            this.MasterTable.Renderer.Modifier.redrawRow(row);
        }
/**
* @internal
*/
        public onClientDataProcessed(e: ITableEventArgs<IClientDataResults>) {
            if (!this._totalsForColumns) this._totalsForColumns = {};

            for (var k in this.Configuration.ColumnsCalculatorFunctions) {
                if (this.Configuration.ColumnsCalculatorFunctions.hasOwnProperty(k)) {
                    this._totalsForColumns[k] = this.Configuration.ColumnsCalculatorFunctions[k](e.EventArgs);
                }
            }
        }
/**
* @internal
*/
        public subscribe(e: PowerTables.Services.EventsService): void {
            e.DataReceived.subscribe(this.onResponse.bind(this), 'totals');
            e.ClientRowsRendering.subscribeBefore(this.onClientRowsRendering.bind(this), 'totals');
            e.ClientDataProcessing.subscribeAfter(this.onClientDataProcessed.bind(this), 'totals');
            e.AdjustmentResult.subscribe(this.onAdjustments.bind(this),'totals');
        }
    }

    ComponentsContainer.registerComponent('Total', TotalsPlugin);
}