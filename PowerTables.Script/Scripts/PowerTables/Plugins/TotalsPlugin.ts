module PowerTables.Plugins {
    import TotalClientConfiguration = PowerTables.Plugins.Total.ITotalClientConfiguration;
    import TotalResponse = PowerTables.Plugins.Total.ITotalResponse;

    export class TotalsPlugin extends PluginBase<TotalClientConfiguration> {
        private _totalsForColumns: { [key: string]: string };

        private makeTotalsRow(): IRow {
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

            var result: IRow = {
                Index: -1,
                MasterTable: this.MasterTable,
                DataObject: dataObject,
                Cells: {},
                renderContent: null,
                renderElement: null
            };

            
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                var cell: ICell = {
                    DataObject: dataObject,
                    renderElement: null,
                    Column: cols[i],
                    Row: result,
                    Data: dataObject[col.RawName]
                };
                result.Cells[col.RawName] = cell;
            }

            return result;
        }

        onResponse(e: ITableEventArgs<IDataEventArgs>) {
            var response = e.EventArgs.Data;
            var total: TotalResponse = response.AdditionalData['Total'];
            this._totalsForColumns = total.TotalsForColumns;
        }

        onClientRowsRendering(e: ITableEventArgs<IRow[]>) {
            if (this._totalsForColumns) {
                if (this.Configuration.ShowOnTop) {
                    e.EventArgs.splice(0, 0, this.makeTotalsRow());
                } else {
                    e.EventArgs.push(this.makeTotalsRow());
                }
            }
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.Events.DataReceived.subscribe(this.onResponse.bind(this), 'totals');
            this.MasterTable.Events.BeforeClientRowsRendering.subscribe(this.onClientRowsRendering.bind(this), 'totals');
            
        }
    }

    ComponentsContainer.registerComponent('Total',TotalsPlugin);
} 