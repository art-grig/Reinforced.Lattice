module PowerTables {
    /**
     * This entity is responsible for integration of data between storage and rendere. 
     * Also it provides functionality for table events subscription and 
     * elements location
     */
    export class Controller {

        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._attachFn = document['addEventListener'] || document['attachEvent'];
            this._matches = (function (el) {
                if (!el) return null;
                var p = el.prototype;
                return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
            } (Element));
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
        private _rootSelector: string;
        private _domEvents: { [key: string]: any } = {};

        private _cellDomSubscriptions: { [key: string]: ISubscription[] } = {};
        private _rowDomSubscriptions: { [key: string]: ISubscription[] } = {};
        private _attachFn: (eventId: string, handler: (e: UIEvent) => any) => void;
        private _matches: (e: HTMLElement) => boolean;

        /**
         * Initializes full reloading cycle
         * @returns {} 
         */
        public reload(): void {
            this._masterTable.Loader.requestServer('query', () => {
                this.redrawVisibleData();
            });
        }

        /**
         * Redraws row containing currently visible data object
         * 
         * @param dataObject Data object
         * @param idx 
         * @returns {} 
         */
        public redrawVisibleDataObject(dataObject: any, idx?:number) {
            if (!idx) {
                var dispIndex = this._masterTable.DataHolder.localLookupDisplayedData(dataObject);
                if (dispIndex == null) throw new Error('Cannot redraw object because it is not displaying currently');
                idx = dispIndex.DisplayedIndex;
            }
            var row = this.produceRow(dataObject, idx);
            this._masterTable.Renderer.redrawRow(row);
        }

        /**
         * Redraws locally visible data
         */
        public redrawVisibleData(): void {
            var rows = this.produceRows();
            this._masterTable.Renderer.body(rows);
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

        /**
         * Subscribe handler to any DOM event happening on particular table cell
         * 
         * @param subscription Event subscription
         */
        public subscribeCellEvent(subscription: IUiSubscription<ICellEventArgs>): void {
            if (!this._cellDomSubscriptions[subscription.EventId]) {
                this._cellDomSubscriptions[subscription.EventId] = [];
            }
            this._cellDomSubscriptions[subscription.EventId].push(subscription);
            this.ensureEventSubscription(subscription.EventId);
        }

        /**
         * Subscribe handler to any DOM event happening on particular table row. 
         * Note that handler will fire even if particular table cell event happened
         * 
         * @param subscription Event subscription
         */
        public subscribeRowEvent(subscription: IUiSubscription<IRowEventArgs>) {
            if (!this._rowDomSubscriptions[subscription.EventId]) {
                this._rowDomSubscriptions[subscription.EventId] = [];
            }
            this._rowDomSubscriptions[subscription.EventId].push(subscription);
            this.ensureEventSubscription(subscription.EventId);
        }

        //#region event delegation hell
        private ensureEventSubscription(eventId: string) {
            var fn = this.onTableEvent.bind(this);
            this._attachFn.call(this._masterTable.Renderer.BodyElement, eventId, fn);
            this._domEvents[eventId] = fn;
        }

        private traverseSubscriptions(target: HTMLElement, eventType: string, originalEvent: Event) {
            var t = target;
            var forRow = this._rowDomSubscriptions[eventType];
            var forCell = this._cellDomSubscriptions[eventType];
            var result: ISubscription[] = [];
            if (!forRow) forRow = [];
            if (!forCell) forCell = [];
            if (forRow.length === 0 && forCell.length === 0) return result;
            var pathToCell = [];
            var pathToRow = [];
            var cellLocation = null, rowIndex = null;

            while (t !== this._masterTable.Renderer.BodyElement) {
                if (this._masterTable.Renderer.Locator.isCell(t)) {
                    cellLocation = TrackHelper.getCellLocation(t);
                }
                if (this._masterTable.Renderer.Locator.isRow(t)) {
                    rowIndex = TrackHelper.getRowIndex(t);
                }
                if (cellLocation == null) pathToCell.push(t);
                if (rowIndex == null) pathToRow.push(t);
                t = t.parentElement;
            }

            if (cellLocation != null) {
                var cellArgs = {
                    Table: this._masterTable,
                    OriginalEvent: originalEvent,
                    DisplayingRowIndex: cellLocation.RowIndex,
                    ColumnIndex: cellLocation.ColumnIndex
                };
                this.traverseAndFire(forCell,pathToCell,cellArgs);
            }

            if (rowIndex != null) {
                var rowArgs = {
                    Table: this._masterTable,
                    OriginalEvent: originalEvent,
                    DisplayingRowIndex: rowIndex
                };
                this.traverseAndFire(forRow,pathToRow,rowArgs);
            }
        }

        private traverseAndFire(subscriptions:ISubscription[],path:any[],args:any) {
            for (var i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].Selector) {
                    for (var j = 0; j < path.length; j++) {
                        if (this._matches.call(path[j], subscriptions[i].Selector)) {
                            subscriptions[i].Handler(args);
                            break;
                        }
                    }
                } else {
                    subscriptions[i].Handler(args);
                }
            }
        }

        private onTableEvent(e: UIEvent) {
            this.traverseSubscriptions(<HTMLElement>(e.target || e.srcElement), e.type, e);
        }
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
                        var row = this.produceRow(insertion.DataObject, insertion.DisplayRowIndex);
                        this._masterTable.Renderer.appendRow(row, insertion.DisplayRowIndex);
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
                        this._masterTable.Renderer.removeRowByIndex(deletion.DisplayRowIndex);
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

                var object = this._masterTable.DataHolder.localLookupStoredData(update.StorageRowIndex);
                update.UpdateFn(object);

                if (update.RedrawBehavior === RedrawBehavior.LocalFullRefresh) this.localFullRefresh();
                else {

                    // not required to update displayed object because we are updating reference

                    if (update.RedrawBehavior === RedrawBehavior.RedrawVisible) this.redrawVisibleData();
                    else if (update.RedrawBehavior === RedrawBehavior.LocalVisibleReorder) this.localVisibleReorder();
                    else if (update.RedrawBehavior === RedrawBehavior.ParticularRowUpdate) {
                        var row = this.produceRow(object, update.DisplayRowIndex);
                        this._masterTable.Renderer.redrawRow(row);
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

            var rw = <IRow>{
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

            for (var j = 0; j < columns.length; j++) {
                var col = columns[j];
                var cell: ICell = {
                    Column: col,
                    Data: dataObject[col.RawName],
                    DataObject: dataObject,
                    Row: rw,
                    renderContent: null,
                    renderElement: null
                };
                cells[col.RawName] = cell;
            }
            rw.Cells = cells;
            return rw;
        }

        private produceRows(): IRow[] {
            this._masterTable.Events.BeforeDataRendered.invoke(this, null);

            var result: IRow[] = [];
            var columns = this._masterTable.InstanceManager.getUiColumns();

            for (var i = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                var row = this.produceRow(this._masterTable.DataHolder.DisplayedData[i], i, columns);
                if (!row) continue;
                result.push(row);
            }

            return result;
        }


    }
    export interface IRowEventArgs {
        /**
        * Master table reference
        */
        Table: IMasterTable;

        /**
         * Original event reference
         */
        OriginalEvent: Event;

        /**
         * Row index. 
         * Data object can be restored using Table.DataHolder.localLookupDisplayedData(RowIndex)
         */
        DisplayingRowIndex: number;
    }

    /**
     * Event arguments for particular cell event
     */
    export interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column index related to particular cell. 
         * Column object can be restored using Table.InstanceManager.getUiColumns()[ColumnIndex]
         */
        ColumnIndex: number;
    }

    export interface ISubscription {
        /**
         * Event Id
         */
        EventId: string;
        /**
         * Selector of element
         */
        Selector?: string;
        /**
         * Subscription ID (for easier unsubscribe)
         */
        SubscriptionId: string;

        Handler: any;
    }

    /**
     * Information about UI subscription
     */
    export interface IUiSubscription<TEventArgs> extends ISubscription {
        /**
         * Event handler 
         * 
         * @param e Event arguments 
         */
        Handler: (e: TEventArgs) => any;
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