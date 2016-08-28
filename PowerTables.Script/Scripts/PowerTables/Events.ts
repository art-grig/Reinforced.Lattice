module PowerTables {
    /**
     * Wrapper for table event with ability to subscribe/unsubscribe
     */
    export class TableEvent<TEventArgs> {

        /*
         * @internal
         */
        constructor(masterTable: any) { this._masterTable = masterTable; }

        private _masterTable: IMasterTable;

        private _handlers: { [key: string]: ((e: ITableEventArgs<TEventArgs>) => any)[] } = {};

        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invoke(thisArg: any, eventArgs: TEventArgs): void {
            var ea: ITableEventArgs<TEventArgs> = {
                MasterTable: this._masterTable,
                EventArgs: eventArgs
            };
            var hndlrs: { [index: string]: { (e: ITableEventArgs<TEventArgs>): any; }[]; } = this._handlers;
            var i: number = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers: { (e: ITableEventArgs<TEventArgs>): any; }[] = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        (<any>kHandlers[i]).apply(thisArg, [ea]);
                    }
                    i = 0;
                }
            }
        }

        /**
         * Subscribes specified function to event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribe(handler: (e: ITableEventArgs<TEventArgs>) => any, subscriber: string): void {
            if (!this._handlers[subscriber]) {
                this._handlers[subscriber] = [];
            }
            this._handlers[subscriber].push(handler);
        }

        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        public unsubscribe(subscriber: string): void {
            this._handlers[subscriber] = null;
            delete this._handlers[subscriber];
        }
    }

    /**
     * Events manager for table. 
     * Contains all available events
     */
    export class EventsManager {
        private _masterTable: any; //todo

        constructor(masterTable: any) {
            this._masterTable = masterTable;
            this.BeforeQueryGathering = new TableEvent(masterTable);
            this.AfterQueryGathering = new TableEvent(masterTable);
            this.BeforeClientQueryGathering = new TableEvent(masterTable);
            this.AfterClientQueryGathering = new TableEvent(masterTable);
            this.BeforeLoading = new TableEvent(masterTable);
            this.LoadingError = new TableEvent(masterTable);
            this.ColumnsCreation = new TableEvent(masterTable);
            this.DataReceived = new TableEvent(masterTable);
            this.AfterLoading = new TableEvent(masterTable);
            this.BeforeLayoutRendered = new TableEvent(masterTable);

            this.BeforeClientDataProcessing = new TableEvent(masterTable);
            this.AfterClientDataProcessing = new TableEvent(masterTable);
            this.AfterLayoutRendered = new TableEvent(masterTable);
            this.BeforeDataRendered = new TableEvent(masterTable);
            this.AfterDataRendered = new TableEvent(masterTable);
            this.BeforeClientRowsRendering = new TableEvent(masterTable);
            this.DeferredDataReceived = new TableEvent(masterTable);
            this.BeforeAdjustment = new TableEvent(masterTable);
            this.AfterAdjustment = new TableEvent(masterTable);
            this.AdjustmentResult = new TableEvent(masterTable);
        }

        /**
         * "Before Layout Drawn" event. 
         * Occurs before layout is actually drawn but after all table is initialized. 
         */
        public BeforeLayoutRendered: TableEvent<any>;


        /**
        * "Before Filter Gathering" event. 
        * Occurs every time before sending request to server via Loader before 
        * filtering information is being gathered. Here you can add your own 
        * additional data to prepared query that will be probably overridden by 
        * other query providers. 
        */
        public BeforeQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        public BeforeClientQueryGathering: TableEvent<IQueryGatheringEventArgs>;

        /**
         * "After Filter Gathering" event. 
         * Occurs every time before sending request to server via Loader AFTER 
         * filtering information is being gathered. Here you can add your own 
         * additional data to prepared query that will probably override parameters 
         * set by another query providers. 
         */
        public AfterQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        public AfterClientQueryGathering: TableEvent<IQueryGatheringEventArgs>;

        /**
         * "Before Loading" event.
         * Occurs every time right before calling XMLHttpRequest.send and
         * passing gathered filters to server
         */
        public BeforeLoading: TableEvent<ILoadingEventArgs>;

        /**
         * "Deferred Data Received" event. 
         * Occurs every time when server has answered to particular query with 
         * with reference to deferred query. It means that server has memorized particular 
         * request with specified token and will proceed data selection/other operations 
         * when you query it by Operatioal AJAX URL + "?q=$Token$". 
         * 
         * This feature is usable when it is necessary e.g. to generate file (excel, PDF) 
         * using current table filters
         */
        public DeferredDataReceived: TableEvent<IDeferredDataEventArgs>;

        /**
         * "Loading Error" event. 
         * Occurs every time when Loader encounters loading error. 
         * It may be caused by server error or network (XMLHttp) error. 
         * Anyway, error text/cause/stacktrace will be supplied as Reason 
         * field of event args         
         */
        public LoadingError: TableEvent<ILoadingErrorEventArgs>;

        /**
         * "Columns Creation" event.
         * Occurs when full columns list formed and available for 
         * modifying. Addition/removal/columns modification is acceptable
         */
        public ColumnsCreation: TableEvent<{ [key: string]: IColumn }>;

        /**
         * "Data Received" event. 
         * Occurs EVERY time when something is being received from server side. 
         * Event argument is deserialized JSON data from server. 
         */
        public DataReceived: TableEvent<IDataEventArgs>;

        public BeforeClientDataProcessing: TableEvent<IQuery>;
        public AfterClientDataProcessing: TableEvent<IClientDataResults>;
        public AfterLayoutRendered: TableEvent<any>;
        public AfterDataRendered: TableEvent<any>;
        public BeforeDataRendered: TableEvent<any>;

        /**
         * "After Loading" event.
         * Occurs every time after EVERY operation connected to server response handling 
         * has been finished
         */
        public AfterLoading: TableEvent<ILoadingEventArgs>;

        /**
         * "Before Client Rows Rendering" event.
         * 
         * Occurs every time after after rows set for client-side was 
         * modified but not rendered yet. Here you can add/remove/modify render for 
         * particular rows
         */
        public BeforeClientRowsRendering: TableEvent<IRow[]>;

        /**
         * Registers new event for events manager. 
         * This method is to be used by plugins to provide their 
         * own events. 
         * 
         * Events being added should be described in plugin's .d.ts file 
         * as extensions to Events manager
         * @param eventName Event name
         * @returns {} 
         */
        public registerEvent<TEventArgs>(eventName: string) {
            this[eventName] = new TableEvent(this._masterTable);
        }

        public SelectionChanged: TableEvent<string[]>; //registered by Checkboxify

        public BeforeAdjustment: TableEvent<PowerTables.Editing.IAdjustmentData>;
        public AfterAdjustment: TableEvent<PowerTables.Editing.IAdjustmentData>;
        public AdjustmentResult: TableEvent<IAdjustmentResult>;

    }

    /**
     * Interface for client data results event args
     */
    export interface IClientDataResults {
        /**
         * Source data
         */
        Source: any[];
        /**
         * Filtered data
         */
        Filtered: any[];
        /**
         * Ordered data
         */
        Ordered: any[];
        /**
         * Actually displaying data
         */
        Displaying: any[];
    }

    /**
     * Event args wrapper for table
     */
    export interface ITableEventArgs<T> {
        /**
         * Reverence to master table
         */
        MasterTable: IMasterTable;

        /**
         * Event arguments
         */
        EventArgs: T;
    }

    /**
     * Event args for loading events
     */
    export interface ILoadingEventArgs {
        /**
         * Query to be sent to server
         */
        Request: IPowerTableRequest;

        /**
         * Request object to be used while sending to server
         */
        XMLHttp: XMLHttpRequest;
    }

    export interface ILoadingResponseEventArgs extends ILoadingEventArgs {
        /**
         * Response received from server
         */
        Response: IPowerTablesResponse;
    }

    /**
     * Event args for loading error event
     */
    export interface ILoadingErrorEventArgs extends ILoadingEventArgs {
        /**
         * Error text
         */
        Reason: string;
    }

    /**
     * Event args for deferred data received event
     */
    export interface IDeferredDataEventArgs extends ILoadingEventArgs {

        /**
         * Token to obtain deferred data
         */
        Token: string;

        /**
         * URL that should be queries to obtain request result
         */
        DataUrl: string;
    }

    /**
     * Event args for data received event
     */
    export interface IDataEventArgs extends ILoadingEventArgs {

        /**
         * Query response
         */
        Data: IPowerTablesResponse;
    }

    /**
     * Event args for query gathering process
     */
    export interface IQueryGatheringEventArgs {
        /**
         * Query is being gathered
         */
        Query: IQuery;

        /**
         * Query scope that is used
         */
        Scope: QueryScope;
    }
}