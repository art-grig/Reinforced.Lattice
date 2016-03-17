module PowerTables {
    import TotalClientConfiguration = PowerTables.Plugins.Total.ITotalClientConfiguration;
    import TotalResponse = PowerTables.Plugins.Total.ITotalResponse;

    export class TotalPlugin
        extends PluginBase<TotalClientConfiguration> {

        private _element: JQuery;
        public TotalRow: JQuery;

        constructor() {
            super();
        }
        subscribe(e: EventsManager): void {
            if (this.Configuration.ShowOnTop) {
                e.BeforeResponseDrawing.subscribe(this.onResponse.bind(this), 'total');
            } else {
                e.ResponseDrawing.subscribe(this.onResponse.bind(this), 'total');
            }
        }

        onResponse(response: IPowerTablesResponse) {
            var total: TotalResponse = response.AdditionalData['Total'];
            if (total) {
                var cols = this.MasterTable.Columns;
                var rowElement = this.MasterTable.Renderer.renderRow(null);

                var row: IRow = {
                    MasterTable: this.MasterTable,
                    DataObject: null,
                    Index: 0,
                    Elements: [],
                    Element: rowElement,
                    Fake: true
                };

                this.TotalRow = rowElement;

                var columnsOrder = this.MasterTable.getColumnNames();
                this.MasterTable.Events.BeforeRowDraw.invoke(this, [row]);
                for (var j = 0; j < columnsOrder.length; j++) {
                    var kk = columnsOrder[j];
                    var column = this.MasterTable.Columns[kk];
                    if (column.Configuration.IsDataOnly) continue;
                    var cell: ICell = {
                        Column: column,
                        Data: null,
                        DataObject: null,
                        Row: row,
                        Element: null,
                        Fake: true
                    };

                    this.MasterTable.Events.BeforeCellDraw.invoke(this, [cell]);

                    var element = null;
                    if (!total.TotalsForColumns[column.RawName]) element = this.MasterTable.Renderer.renderRawCell('');
                    else {
                        var value = total.TotalsForColumns[column.RawName];
                        if (this.Configuration.ColumnsValueFunctions[column.RawName]) {
                            value = this.Configuration.ColumnsValueFunctions[column.RawName](value);
                        }

                        value = `<strong>${value}</strong>`;
                        element = this.MasterTable.Renderer.renderRawCell(value);
                    }

                    cell.Element = element;
                    column.Elements.push(element);
                    row.Elements.push(element);
                    this.MasterTable.Events.AfterCellDraw.invoke(this, [cell]);
                    rowElement = rowElement.append(element);
                }
                this.MasterTable.Renderer.appendRow(rowElement);
                this.MasterTable.Events.AfterRowDraw.invoke(this, [row]);
            }
        }

        IsToolbarPlugin: boolean = false;
        PluginId: string = 'Total';
        IsRenderable: boolean = false;
        IsQueryModifier: boolean = false;


    }

    ComponentsContainer.registerComponent('Total', TotalPlugin);
} 