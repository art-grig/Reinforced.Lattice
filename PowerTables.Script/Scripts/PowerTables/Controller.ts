module PowerTables {
    /**
     * This entity is responsible for integration of data between storage and rendere. 
     * Also it provides functionality for table events subscription and 
     * elements location
     */
    export class Controller {

        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
        }

        private _masterTable: IMasterTable;
        
        /**
         * Initializes full reloading cycle
         * @returns {} 
         */
        public reload(forceServer?: boolean): void {
            this._masterTable.Loader.requestServer('query', () => {
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
                var dispIndex: ILocalLookupResult = this._masterTable.DataHolder.localLookupDisplayedData(dataObject);
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

        public drawAdjustmentResult(adjustmentResult: IAdjustmentResult) {
            var adjRowTemplate = this._masterTable.InstanceManager.Configuration.TouchedRowTemplateId;
            var adjCellTemplate = this._masterTable.InstanceManager.Configuration.TouchedCellTemplateId;
            var addedTemplate = this._masterTable.InstanceManager.Configuration.AddedRowTemplateId;
            this._masterTable.Events.AdjustmentResult.invoke(this, adjustmentResult);

            var rows: IRow[] = this.produceRows();

            for (var i = 0; i < rows.length; i++) {
                var needRedrawRow = false;
                var cellsToRedraw = [];

                if (adjustmentResult.AddedData.indexOf(rows[i]) > -1) {
                    if (addedTemplate) {
                        rows[i].TemplateIdOverride = addedTemplate;
                    }
                    needRedrawRow = true;
                } else {
                    var adjIdx = adjustmentResult.TouchedData.indexOf(rows[i].DataObject);
                    if (adjIdx > -1) {
                        if (adjRowTemplate) {
                            rows[i].TemplateIdOverride = adjRowTemplate;
                            needRedrawRow = true;
                        }

                        var cols = adjustmentResult.TouchedColumns[adjIdx];
                        for (var j = 0; j < cols.length; j++) {
                            if (!rows[i].Cells.hasOwnProperty(cols[j])) continue;
                            var cell = rows[i].Cells[cols[j]];
                            
                            if (adjCellTemplate) {
                                cell.TemplateIdOverride = adjCellTemplate;
                            }
                            cell.IsUpdated = true;
                            if (!needRedrawRow) {
                                cellsToRedraw.push(cell);
                            }
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
                this._masterTable.Renderer.body(rows);
            }
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
                renderElement: null
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
                MasterTable: this._masterTable
            }
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
            this._masterTable.Events.BeforeDataRendered.invoke(this, null);

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

    /**
     * Behavior of redrawing table after modification
     */
    export enum RedrawBehavior {

        /**
         * To perform UI redraw, data will be entirely reloaded from server. 
         * Local data will not be affected due to further reloading
         */
        ReloadFromServer,

        /**
         * Filters will be reapplied only locally. 
         * Currently displaying data will be entirely redrawn with client filters 
         * using locally cached data from server. 
         * 
         * In this case, if modified rows are not satisfying any server conditions then 
         * is will still stay in table. That may seem illogical for target users.
         */
        LocalFullRefresh,

        /**
         * Filters will be reapplied locally but only on currently displaying data. 
         * 
         * In this case, deleted row will simply disappear, added row will be added to currently 
         * displaying cells set and currently displaying set will be re-ordered, modified 
         * row will be ordered among only displaying set without filtering. 
         * This approach is quite fast and may be useful in various cases
         */
        LocalVisibleReorder,

        /**
         * Simply redraw all the visible cells without additional filtering.
         * 
         * May lead to glitches e.g. invalid elements count on page or invalid 
         * items order. Most suitable for updating that does not touch filtering/ordering-sensetive
         * data.
         */
        RedrawVisible,

        /**
         * Only particular row mentioned in modification request will be updated. 
         * No server reloading, no reordering, no re-sorting. Row will stay in place or 
         * will be added at specified position or will be simply disappear from currently displayed set. 
         * In some cases such behavior may confuse users, but still stay suitable for most cases. 
         * Of course, it will disappear after on next filtering if no more satisfying 
         * filter conditions.
         */
        ParticularRowUpdate,

        /**
         * Modification request will not affect UI anyhow until next filtering. Confusing.
         */
        DoNothing
    }
}