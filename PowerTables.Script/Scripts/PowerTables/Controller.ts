module PowerTables {
    /**
     * This entity is responsible for integration of data between storage and rendere. 
     * Also it provides functionality for table events subscription and 
     * elements location
     */
    export class Controller {

        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;

            this._masterTable.Events.LoadingError.subscribe(this.onLoadingError.bind(this), 'controller');
        }

        private onLoadingError(e: ITableEventArgs<ILoadingErrorEventArgs>) {
            this.showTableMessage({
                Message: e.EventArgs.Reason,
                MessageType: 'error',
                AdditionalData: e.EventArgs.StackTrace,
                IsMessage: true
            });
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
                this.showTableMessage({
                    MessageType: 'noresults',
                    Message: 'No data found',
                    AdditionalData: 'Try specifying different filter settings'
                });
            } else {
                this._masterTable.Renderer.body(rows);
            }
        }

        public drawAdjustmentResult(adjustmentResult: IAdjustmentResult) {
            var adjRowTemplate = this._masterTable.InstanceManager.Configuration.TouchedRowTemplateId;
            var adjCellTemplate = this._masterTable.InstanceManager.Configuration.TouchedCellTemplateId;
            var addedTemplate = this._masterTable.InstanceManager.Configuration.AddedRowTemplateId;

            var rows: IRow[] = this.produceRows();

            for (var i = 0; i < rows.length; i++) {
                if (addedTemplate) {
                    if (adjustmentResult.AddedData.indexOf(rows[i]) > -1) {
                        rows[i].TemplateIdOverride = addedTemplate;
                        if (!adjustmentResult.NeedRedrawAllVisible) {
                            this._masterTable.Renderer.Modifier.redrawRow(rows[i]);
                        }
                        continue;
                    }
                }
                var adjIdx = adjustmentResult.TouchedData.indexOf(rows[i]);
                var needRedrawRow = false;

                if (adjRowTemplate) {
                    if (adjIdx > -1) {
                        rows[i].TemplateIdOverride = adjRowTemplate;
                        needRedrawRow = true;
                    }
                }
                if (adjCellTemplate) {
                    if (adjIdx > -1) {
                        var cols = adjustmentResult.TouchedColumns[adjIdx];
                        for (var j = 0; j < cols.length; j++) {
                            var cell = rows[i].Cells[cols[j]];
                            cell.TemplateIdOverride = adjCellTemplate;
                            needRedrawRow = true;
                        }
                    }
                }
                if (needRedrawRow && !adjustmentResult.NeedRedrawAllVisible) {
                    this._masterTable.Renderer.Modifier.redrawRow(rows[i]);
                }
            }
            if (adjustmentResult.NeedRedrawAllVisible) {
                this._masterTable.Renderer.body(rows);
            }
        }

        /**
         * Shows full-width table message
         * @param tableMessage Message of type ITableMessage
         * @returns {} 
         */
        public showTableMessage(tableMessage: ITableMessage) {
            tableMessage.UiColumnsCount = this._masterTable.InstanceManager.getUiColumns().length;
            tableMessage.IsMessage = true;
            this._masterTable.DataHolder.DisplayedData = [tableMessage];
            this.redrawVisibleData();
        }


        //#region event delegation hell


        //#endregion

        /**
         * Inserts data entry to local storage 
         * 
         * @param insertion Insertion command         
         */
        public insertLocalRow(insertion: IInsertRequest): void {
            if (insertion.RedrawBehavior === RedrawBehavior.ReloadFromServer) {
                this.reload();
            } else {
                this._masterTable.DataHolder.StoredData.splice(insertion.StorageRowIndex, 0, insertion.DataObject);

                if (insertion.RedrawBehavior === RedrawBehavior.LocalFullRefresh) this.localFullRefresh();
                else {
                    this._masterTable.DataHolder.DisplayedData.splice(insertion.DisplayRowIndex, 0, insertion.DataObject);

                    if (insertion.RedrawBehavior === RedrawBehavior.RedrawVisible) this.redrawVisibleData();
                    else if (insertion.RedrawBehavior === RedrawBehavior.LocalVisibleReorder) this.localVisibleReorder();
                    else if (insertion.RedrawBehavior === RedrawBehavior.ParticularRowUpdate) {
                        var row: IRow = this.produceRow(insertion.DataObject, insertion.DisplayRowIndex);
                        this._masterTable.Renderer.Modifier.appendRow(row, insertion.DisplayRowIndex);
                    }
                }
            }
        }

        /**
         * Removes data entry from local storage 
         * 
         * @param insertion Insertion command         
         */
        public deleteLocalRow(deletion: IDeleteRequest) {
            if (deletion.RedrawBehavior === RedrawBehavior.ReloadFromServer) {
                this.reload();
            } else {
                this._masterTable.DataHolder.StoredData.splice(deletion.StorageRowIndex, 1);

                if (deletion.RedrawBehavior === RedrawBehavior.LocalFullRefresh) this.localFullRefresh();
                else {
                    this._masterTable.DataHolder.DisplayedData.splice(deletion.DisplayRowIndex, 1);

                    if (deletion.RedrawBehavior === RedrawBehavior.RedrawVisible) this.redrawVisibleData();
                    else if (deletion.RedrawBehavior === RedrawBehavior.LocalVisibleReorder) this.localVisibleReorder();
                    else if (deletion.RedrawBehavior === RedrawBehavior.ParticularRowUpdate) {
                        this._masterTable.Renderer.Modifier.destroyRowByIndex(deletion.DisplayRowIndex);
                    }
                }
            }
        }

        /**
         * Updates data entry in local storage
         * 
         * @param insertion Insertion command         
         */
        public updateLocalRow(update: IUpdateRequest) {
            if (update.RedrawBehavior === RedrawBehavior.ReloadFromServer) {
                this.reload();
            } else {

                var object: ILocalLookupResult = this._masterTable.DataHolder.localLookupStoredData(update.StorageRowIndex);
                update.UpdateFn(object);

                if (update.RedrawBehavior === RedrawBehavior.LocalFullRefresh) this.localFullRefresh();
                else {

                    // not required to update displayed object because we are updating reference

                    if (update.RedrawBehavior === RedrawBehavior.RedrawVisible) this.redrawVisibleData();
                    else if (update.RedrawBehavior === RedrawBehavior.LocalVisibleReorder) this.localVisibleReorder();
                    else if (update.RedrawBehavior === RedrawBehavior.ParticularRowUpdate) {
                        var row: IRow = this.produceRow(object, update.DisplayRowIndex);
                        this._masterTable.Renderer.Modifier.redrawRow(row);
                    }
                }
            }
        }

        private localFullRefresh() {
            this._masterTable.DataHolder.filterStoredDataWithPreviousQuery();
            this.redrawVisibleData();
        }

        private localVisibleReorder() {
            this._masterTable.DataHolder.DisplayedData = this._masterTable.DataHolder.orderSet(
                this._masterTable.DataHolder.DisplayedData, this._masterTable.DataHolder.RecentClientQuery);
            this.redrawVisibleData();
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
            if (dataObject.IsMessage) {
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

    /**
     * Base interface for modification commands
     */
    export interface IModificationRequest {
        /**
         * Behavior of refreshing UI after data modification. 
         * See help for RedrawBehavior for details
         */
        RedrawBehavior: RedrawBehavior;

        /**
         * Index of row among stored data
         */
        StorageRowIndex: number;

        /**
         * Index of row among displaying data
         */
        DisplayRowIndex: number;
    }

    /**
     * Data insertion request
     */
    export interface IInsertRequest extends IModificationRequest {
        /**
         * Object to insert
         */
        DataObject: any;
    }

    /**
     * Data removal request
     */
    export interface IDeleteRequest extends IModificationRequest {

    }

    /**
     * Data update request
     */
    export interface IUpdateRequest extends IModificationRequest {
        /**
         * Function that will be called on object being updated
         * 
         * @param object Data object          
         */
        UpdateFn: (object: any) => void
    }

    export interface ITableMessage {
        Message: string;
        AdditionalData: string;
        MessageType: string;
        UiColumnsCount?: number;
        IsMessage?: boolean;
    }
}