module PowerTables {
    import TrackHelper = PowerTables.Rendering.TrackHelper; /**
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
        }

        private _masterTable: IMasterTable;
        private _rootSelector: string;
        private _domEvents: { [key: string]: any } = {};

        private _cellDomSubscriptions: { [key: string]: ISubscription[] } = {};
        private _rowDomSubscriptions: { [key: string]: ISubscription[] } = {};
        private _attachFn: (eventId: string, handler: (e: UIEvent) => any) => void;
        private _matches:(e:HTMLElement)=>boolean;

        /**
         * Initializes full reloading cycle
         * @returns {} 
         */
        public reload(): void {
            this._masterTable.Loader.requestServer('query', a => {
                this.redrawCurrentlyDisplayingObjects();
            });
        }

        private redrawCurrentlyDisplayingObjects() {
            var rows = this.produceRows();
            this._masterTable.Renderer.body(rows);
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

        private ensureEventSubscription(eventId: string) {
            var fn = this.onTableEvent.bind(this);
            this._attachFn(eventId, fn);
            this._domEvents[eventId] = fn;
        }

        private onTableEvent(e: UIEvent) {
            var subscriptions: ISubscription[] = null;
            var isCell = false;
            if (this._masterTable.Renderer.Locator.isCell(<HTMLElement>e.currentTarget)) {
                subscriptions = this._cellDomSubscriptions[e.type];
                isCell = true;
            }
            if (this._masterTable.Renderer.Locator.isRow(<HTMLElement>e.currentTarget)) {
                subscriptions = this._rowDomSubscriptions[e.type];
            }
            if (!subscriptions) return;
            if (subscriptions.length === 0) return;
            var eventArgs: any = null;
            if (isCell) {
                var location = TrackHelper.getCellLocation(<HTMLElement>e.currentTarget);
                eventArgs = <ICellEventArgs>{
                    Table: this._masterTable,
                    RowIndex: location.RowIndex,
                    ColumnIndex: location.ColumnIndex,
                    OriginalEvent: e
                }
            } else {
                var ridx = TrackHelper.getRowIndex(<HTMLElement>e.currentTarget);
                eventArgs = <IRowEventArgs>{
                    Table: this._masterTable,
                    RowIndex: ridx,
                    OriginalEvent: e
                }
            }
            for (var i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].Selector) {
                    if (!this._matches.apply(e.target, subscriptions[i].Selector))
                        continue;
                }
                subscriptions[i].Handler(eventArgs);
            }
        }

        public insertLocalRow(object: any, index: number) {

        }

        public deleteLocalRow(index: number) {

        }

        public updateLocalRow(index: number, updateFn: (object: any) => void) {

        }

        public produceRow(dataObject: any, columns: IColumn[], idx: number): IRow {
            var rw = <IRow>{
                DataObject: dataObject[idx],
                Index: idx,
                MasterTable: this._masterTable
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
            var result: IRow[] = [];
            var columns = this._masterTable.InstanceManager.getUiColumns();

            for (var i = 0; i < this._masterTable.DataHolder.CurrentlyDisplaying.length; i++) {
                result.push(this.produceRow(this._masterTable.DataHolder.CurrentlyDisplaying[i], columns, i));
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
         * Data object can be restored using Table.DataHolder.localLookupCurrentlyDisplaying(RowIndex)
         */
        RowIndex: number;
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
} 