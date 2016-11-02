
module PowerTables.Services {
    /**
     * This entity is responsible for integration of data between storage and rendere. 
     * Also it provides functionality for table events subscription and 
     * elements location
     */
    export class Controller {

        /**
         * @internal
         */
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
        }

        private _masterTable: IMasterTable;

        /**
         * Initializes full reloading cycle
         * @returns {} 
         */
        public reload(forceServer?: boolean): void {
            this._masterTable.Loader.requestServer('query', (e: IPowerTablesResponse) => {
                if (e == null) {
                    this.redrawVisibleData();
                    return;
                }
                if (e['Success'] === false && e['Message'] && e['Message']['__Go7XIV13OA'] === true) {
                    return;
                }
                this.redrawVisibleData();
            }, null, null, forceServer);
        }

        /**
         * Redraws row containing currently visible data object
         * 
         * @param dataObject Data object
         * @param idx 
         * @returns {} 
         */
        public redrawVisibleDataObject(dataObject: any, idx?: number): HTMLElement {
            if (idx == null || idx == undefined) {
                var dispIndex: ILocalLookupResult = this._masterTable.DataHolder.localLookupDisplayedDataObject(dataObject);
                if (dispIndex == null) throw new Error('Cannot redraw object because it is not displaying currently');
                idx = dispIndex.DisplayedIndex;
            }
            var row: IRow = this.produceRow(dataObject, idx);
            return this._masterTable.Renderer.Modifier.redrawRow(row);
        }

        /**
         * Redraws locally visible data
         */
        public redrawVisibleData(): void {
            var rows: IRow[] = this.produceRows();
            if (rows.length === 0) {
                this._masterTable.MessageService.showMessage({
                    Class: 'noresults',
                    Title: 'No data found',
                    Details: 'Try specifying different filter settings',
                    Type: MessageType.Banner
                });
            } else {
                this._masterTable.Renderer.body(rows);
            }
        }


        /**
         * Redraws locally visible data
         */
        public replaceVisibleData(rows: IRow[]): void {
            this._masterTable.Renderer.body(rows);
        }

        public redrawVisibleCells(dataObject: any, columns: IColumn[]) {
            var dispIndex: ILocalLookupResult = this._masterTable.DataHolder.localLookupDisplayedDataObject(dataObject);
            if (dispIndex == null) throw new Error('Cannot redraw cells because proposed object it is not displaying currently');
            var row = this.produceRow(dataObject, dispIndex.DisplayedIndex);
            for (var i = 0; i < columns.length; i++) {
                if (row.Cells.hasOwnProperty(columns[i].RawName)) {
                    this._masterTable.Renderer.Modifier.redrawCell(row.Cells[columns[i].RawName]);
                }
            }
        }

        public redrawColumns(columns: IColumn[]) {
            var rows = this.produceRows();
            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < columns.length; j++) {
                    this._masterTable.Renderer.Modifier.redrawCell(rows[i].Cells[columns[j].RawName]);
                }
            }
        }

        /**
         * @internal
         */
        public drawAdjustmentResult(adjustmentResult: IAdjustmentResult) {
            this._masterTable.Events.AdjustmentResult.invoke(this, adjustmentResult);

            var rows: IRow[] = this.produceRows();

            for (var i = 0; i < rows.length; i++) {
                var needRedrawRow = false;
                var cellsToRedraw: ICell[] = [];

                if (adjustmentResult.AddedData.indexOf(rows[i]) > -1) {
                    rows[i].IsAdded = true;
                    needRedrawRow = true;
                } else {
                    var adjIdx = adjustmentResult.TouchedData.indexOf(rows[i].DataObject);
                    if (adjIdx > -1) {
                        rows[i].IsUpdated = true;
                        needRedrawRow = true;

                        var cols = adjustmentResult.TouchedColumns[adjIdx];
                        for (var j = 0; j < cols.length; j++) {
                            if (!rows[i].Cells.hasOwnProperty(cols[j])) continue;
                            var cell = rows[i].Cells[cols[j]];
                            cell.IsUpdated = true;
                            cellsToRedraw.push(cell);
                        }
                    }
                }
                if (needRedrawRow && !adjustmentResult.NeedRedrawAllVisible) {
                    this._masterTable.Renderer.Modifier.redrawRow(rows[i]);
                } else {
                    if (cellsToRedraw.length > 0) {
                        for (var k = 0; k < cellsToRedraw.length; k++) {
                            this._masterTable.Renderer.Modifier.redrawCell(cellsToRedraw[k]);
                        }
                    }
                }

            }
            if (adjustmentResult.NeedRedrawAllVisible) {
                if (rows.length == 0) this.redrawVisibleData();
                else this._masterTable.Renderer.body(rows);
            }
            this._masterTable.Events.Adjustment.invokeAfter(this, adjustmentResult);

        }

        /**
         * Converts data object,row and column to cell
         * 
         * @param dataObject Data object
         * @param idx Object's displaying index
         * @param column Column that this cell belongs to
         * @param row Row that this cell belongs to
         * @returns {ICell} Cell representing data
         */
        public produceCell(dataObject: any, column: IColumn, row: IRow): ICell {
            return {
                Column: column,
                Data: dataObject[column.RawName],
                DataObject: dataObject,
                Row: row,
                renderContent: null,
                renderElement: null,
                IsSelected: this._masterTable.Selection.isCellSelected(dataObject, column)
            };
        }

        /**
         * Converts data object to display row
         * 
         * @param dataObject Data object
         * @param idx Object's displaying index
         * @param columns Optional displaying columns set
         * @returns {IRow} Row representing displayed object
         */
        public produceRow(dataObject: any, idx: number, columns?: IColumn[]): IRow {
            if (!dataObject) return null;
            if (!columns) columns = this._masterTable.InstanceManager.getUiColumns();

            var rw: IRow = <IRow>{
                DataObject: dataObject,
                Index: idx,
                MasterTable: this._masterTable,
                IsSelected: this._masterTable.Selection.isSelected(dataObject),
                CanBeSelected: this._masterTable.Selection.canSelect(dataObject),
                Cells: null
            };

            if (dataObject.IsMessageObject) {
                dataObject.UiColumnsCount = columns.length;
                rw.renderElement = hb => hb.getCachedTemplate('messages')(dataObject);
                rw.IsSpecial = true;
                return rw;
            }
            var cells: { [key: string]: ICell } = {};


            for (var j: number = 0; j < columns.length; j++) {
                var col: IColumn = columns[j];
                var cell = this.produceCell(dataObject, col, rw);
                cells[col.RawName] = cell;
            }
            rw.Cells = cells;
            return rw;
        }

        private produceRows(): IRow[] {
            this._masterTable.Events.DataRendered.invokeBefore(this, null);

            var result: IRow[] = [];
            var columns: IColumn[] = this._masterTable.InstanceManager.getUiColumns();

            for (var i: number = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                var row: IRow = this.produceRow(this._masterTable.DataHolder.DisplayedData[i], i, columns);
                if (!row) continue;
                result.push(row);
            }

            return result;
        }


    }
}