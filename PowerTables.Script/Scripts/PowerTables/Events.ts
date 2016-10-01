module PowerTables {
    /**
     * Wrapper for table event with ability to subscribe/unsubscribe
     */
    export class TableEvent<TBeforeEventArgs,TAfterEventArgs> {

        /*
         * @internal
         */
        constructor(masterTable: any) { this._masterTable = masterTable; }

        private _masterTable: IMasterTable;

        private _handlersAfter: { [key: string]: ((e: ITableEventArgs<TAfterEventArgs>) => any)[] } = {};
        private _handlersBefore: { [key: string]: ((e: ITableEventArgs<TBeforeEventArgs>) => any)[] } = {};

        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invokeBefore(thisArg: any, eventArgs: TBeforeEventArgs): void {
            var ea: ITableEventArgs<TBeforeEventArgs> = {
                MasterTable: this._masterTable,
                EventArgs: eventArgs,
                EventDirection: EventDirection.Before
        };
            var hndlrs: { [index: string]: { (e: ITableEventArgs<TBeforeEventArgs>): any; }[]; } = this._handlersBefore;
            var i: number = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers: { (e: ITableEventArgs<TBeforeEventArgs>): any; }[] = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        (<any>kHandlers[i]).apply(thisArg, [ea]);
                    }
                    i = 0;
                }
            }
        }


        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invokeAfter(thisArg: any, eventArgs: TAfterEventArgs): void {
            var ea: ITableEventArgs<TAfterEventArgs> = {
                MasterTable: this._masterTable,
                EventArgs: eventArgs,
                EventDirection: EventDirection.After
            };
            var hndlrs: { [index: string]: { (e: ITableEventArgs<TAfterEventArgs>): any; }[]; } = this._handlersAfter;
            var i: number = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers: { (e: ITableEventArgs<TAfterEventArgs>): any; }[] = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        (<any>kHandlers[i]).apply(thisArg, [ea]);
                    }
                    i = 0;
                }
            }
        }


        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invoke(thisArg: any, eventArgs: TAfterEventArgs): void {
            this.invokeAfter(thisArg,eventArgs);
        }

        /**
         * Subscribes specified function to AFTER event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribeAfter(handler: (e: ITableEventArgs<TAfterEventArgs>) => any, subscriber: string): void {
            if (!this._handlersAfter[subscriber]) {
                this._handlersAfter[subscriber] = [];
            }
            this._handlersAfter[subscriber].push(handler);
        }

        /**
         * Subscribes specified function to AFTER event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribe(handler: (e: ITableEventArgs<TAfterEventArgs>) => any, subscriber: string): void {
            this.subscribeAfter(handler,subscriber);
        }

        /**
         * Subscribes specified function to BEFORE event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribeBefore(handler: (e: ITableEventArgs<TBeforeEventArgs>) => any, subscriber: string): void {
            if (!this._handlersBefore[subscriber]) {
                this._handlersBefore[subscriber] = [];
            }
            this._handlersBefore[subscriber].push(handler);
        }

        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        public unsubscribe(subscriber: string): void {
            this._handlersAfter[subscriber] = null;
            delete this._handlersAfter[subscriber];
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
            this.QueryGathering = new TableEvent(masterTable);
            this.ClientQueryGathering = new TableEvent(masterTable);
            this.Loading = new TableEvent(masterTable);
            this.LoadingError = new TableEvent(masterTable);
            this.ColumnsCreation = new TableEvent(masterTable);
            this.DataReceived = new TableEvent(masterTable);
            this.LayoutRendered = new TableEvent(masterTable);

            this.ClientDataProcessing = new TableEvent(masterTable);
            this.DataRendered = new TableEvent(masterTable);
            this.ClientRowsRendering = new TableEvent(masterTable);
            this.DeferredDataReceived = new TableEvent(masterTable);
            this.Adjustment = new TableEvent(masterTable);
            this.AdjustmentResult = new TableEvent(masterTable);
            this.Edit = new TableEvent(masterTable);
            this.EditValidationFailed = new TableEvent(masterTable);
        }

        /**
         * "Before Layout Drawn" event. 
         * Occurs before layout is actually drawn but after all table is initialized. 
         */
        public LayoutRendered: TableEvent<any,any>;


        /**
        * "Before Filter Gathering" event. 
        * Occurs every time before sending request to server via Loader before 
        * filtering information is being gathered. Here you can add your own 
        * additional data to prepared query that will be probably overridden by 
        * other query providers. 
        */
        public QueryGathering: TableEvent<IQueryGatheringEventArgs, IQueryGatheringEventArgs>;
        public ClientQueryGathering: TableEvent<IQueryGatheringEventArgs, IQueryGatheringEventArgs>;

        /**
         * "Before Loading" event.
         * Occurs every time right before calling XMLHttpRequest.send and
         * passing gathered filters to server
         */
        public Loading: TableEvent<ILoadingEventArgs, ILoadingEventArgs>;

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
        public DeferredDataReceived: TableEvent<IDeferredDataEventArgs,any>;

        /**
         * "Loading Error" event. 
         * Occurs every time when Loader encounters loading error. 
         * It may be caused by server error or network (XMLHttp) error. 
         * Anyway, error text/cause/stacktrace will be supplied as Reason 
         * field of event args         
         */
        public LoadingError: TableEvent<ILoadingErrorEventArgs,any>;

        /**
         * "Columns Creation" event.
         * Occurs when full columns list formed and available for 
         * modifying. Addition/removal/columns modification is acceptable
         */
        public ColumnsCreation: TableEvent<{ [key: string]: IColumn },any>;

        /**
         * "Data Received" event. 
         * Occurs EVERY time when something is being received from server side. 
         * Event argument is deserialized JSON data from server. 
         */
        public DataReceived: TableEvent<IDataEventArgs,any>;

        public ClientDataProcessing: TableEvent<IQuery, IClientDataResults>;
        public DataRendered: TableEvent<any, any>;

      
        /**
         * "Before Client Rows Rendering" event.
         * 
         * Occurs every time after after rows set for client-side was 
         * modified but not rendered yet. Here you can add/remove/modify render for 
         * particular rows
         */
        public ClientRowsRendering: TableEvent<IRow[],any>;

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

        public SelectionChanged: TableEvent<string[],any>; //registered by Checkboxify

        public Adjustment: TableEvent<PowerTables.Editing.IAdjustmentData, PowerTables.IAdjustmentResult>;
        public AdjustmentResult: TableEvent<IAdjustmentResult,any>;

        /**
         * Event that occurs when editing entry. 
         * Event parameter is object that is being edited
         */
        public Edit: TableEvent<any, any>;


        /**
         * Event that occurs when edit validation failed
         */
        public EditValidationFailed: TableEvent<IEditValidationEvent, IEditValidationEvent>;
    }

    export interface IEditValidationEvent {
        OriginalDataObject: any;
        ModifiedDataObject: any;
        ValidationMessages:PowerTables.Editing.IValidationMessage[];
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

        /**
         * Describes event direction
         */
        EventDirection: EventDirection;
    }

    export enum EventDirection {
        Before,
        After,
        Undirected
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