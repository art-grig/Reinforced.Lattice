module PowerTables.Services {


    /**
     * Events manager for table. 
     * Contains all available events
     */
    export class EventsService {
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
            this.DeferredDataReceived = new TableEvent(masterTable);
            this.Adjustment = new TableEvent(masterTable);
            this.AdjustmentResult = new TableEvent(masterTable);
            this.Edit = new TableEvent(masterTable);
            this.EditValidationFailed = new TableEvent(masterTable);

            this.SelectionChanged = new TableEvent(masterTable);
            this.PartitionChanged = new TableEvent(masterTable);
            this.Filtered = new TableEvent(masterTable);
            this.Ordered = new TableEvent(masterTable);
            this.Partitioned = new TableEvent(masterTable);
        }

        /**
         * "Before Layout Drawn" event. 
         * Occurs before layout is actually drawn but after all table is initialized. 
         */
        public LayoutRendered: TableEvent<any, any>;


        /**
        * "Before Filter Gathering" event. 
        * Occurs every time before sending request to server via LoaderService before 
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
        public DeferredDataReceived: TableEvent<IDeferredDataEventArgs, any>;

        /**
         * "Loading Error" event. 
         * Occurs every time when LoaderService encounters loading error. 
         * It may be caused by server error or network (XMLHttp) error. 
         * Anyway, error text/cause/stacktrace will be supplied as Reason 
         * field of event args         
         */
        public LoadingError: TableEvent<ILoadingErrorEventArgs, any>;

        /**
         * "Columns Creation" event.
         * Occurs when full columns list formed and available for 
         * modifying. Addition/removal/columns modification is acceptable
         */
        public ColumnsCreation: TableEvent<{ [key: string]: IColumn }, any>;

        /**
         * "Data Received" event. 
         * Occurs EVERY time when something is being received from server side. 
         * Event argument is deserialized JSON data from server. 
         */
        public DataReceived: TableEvent<IDataEventArgs, IDataEventArgs>;

        public ClientDataProcessing: TableEvent<IQuery, IClientDataResults>;
        public DataRendered: TableEvent<any, any>;

        public Filtered: TableEvent<any[], any[]>;
        public Ordered: TableEvent<any[], any[]>;
        public Partitioned: TableEvent<any[], any[]>;
        
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

        public SelectionChanged: TableEvent<{ [primaryKey: string]: number[] }, { [primaryKey: string]: number[] }>; //registered by Checkboxify

        public Adjustment: TableEvent<PowerTables.ITableAdjustment, IAdjustmentResult>;
        public AdjustmentResult: TableEvent<IAdjustmentResult, any>;
        public PartitionChanged: TableEvent<IPartitionChangeEventArgs, IPartitionChangeEventArgs>;

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


}