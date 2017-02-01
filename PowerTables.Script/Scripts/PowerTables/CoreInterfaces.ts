module PowerTables {

    /**
     * Client filter interface. 
     * This interface is registerable in the DataHolderService as 
     * one of the part of filtering pipeline
     */
    export interface IClientFilter {

        /**
         * Predicate function that must return 'true' for 
         * row that is actually suitable to be displayed according to 
         * implementor's settings
         * 
         * @param rowObject Row table object
         * @param query Data query
         * @returns True if row is suitable to be shown. False otherwise
         */
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }

    /**
     * Plugin interface. 
     * Leave both render functions null to obtain non-displaying plugin
     */
    export interface IPlugin extends IRenderable {

        /**
         * Raw configuration object including Plugin Id
         */
        RawConfig: Configuration.Json.IPluginConfiguration;

        /**
         * Plugin Id including placement
         */
        PluginLocation: string;

        /**
         * Plugin order among its location
         */
        Order: number;

        /**
         * Beginning of plugin lifecycle
         * 
         * @param masterTable 
         * @param configuration          
         */
        init(masterTable: IMasterTable): void;


    }

    /**
     * Main table interface for breaking additional dependencies
     */
    export interface IMasterTable {
        /**
        * API for raising and handling various table events
        */
        Events: PowerTables.Services.EventsService;

        /**
         * API for managing local data
         */
        DataHolder: PowerTables.Services.DataHolderService;

        /**
         * API for data loading
         */
        Loader: PowerTables.Services.LoaderService;

        /**
         * API for rendering functionality
         */
        Renderer: Rendering.Renderer;

        /**
         * API for locating instances of different components
         */
        InstanceManager: PowerTables.Services.InstanceManagerService;

        /**
         * API for overall workflow controlling
         */
        Controller: PowerTables.Services.Controller;

        /**
         * API for working with dates
         */
        Date: PowerTables.Services.DateService;

        /**
         * API for working with selection
         */
        Selection: PowerTables.Services.SelectionService;

        /**
         * Absorb and draw table adjustments
         * 
         * @param adjustments Table adjustmetns object         
         */
        proceedAdjustments(adjustments: PowerTables.ITableAdjustment): void;

        /**
        * API for table messages
        */
        MessageService: PowerTables.Services.MessagesService;

        /**
         * API for commands
         */
        Commands: PowerTables.Services.CommandsService;

        Partition: PowerTables.Services.Partition.IPartitionService;

        getStaticData(): any;

        setStaticData(obj: any): void;
    }

    /**
     * This enumeration distinguishes which way 
     * underlying query will be used
     */
    export enum QueryScope {
        /**
         * Mentioned query will be sent to server to obtain 
         * data (probably) for further local filtration. 
         * All locally filtered fields should be excluded from 
         * underlying query
         */
        Server,

        /**
         * Mentioned query will be used for local data filtration. 
         * To gain performance, please exclude all data settings that were 
         * applied during server request
         */
        Client,

        /**
         * This query should contain both data for client and server filtering. 
         * Transboundary queries are used to obtain query settings 
         * that will be used on server side to retrieve data set that 
         * will be used for server command handling, so server needs all filtering settings
         */
        Transboundary
    }

    /**
     * Interface for classes that are available to modify data query
     */
    export interface IQueryPartProvider {

        /**
         * This method is called every time when master table needs 
         * data query for its reasons. You will receive existing query part in 
         * 'query' parameter and query scope denoting which this query will be used for 
         * in 'scope' parameter
         * 
         * @param query Existing query part
         * @param scope Query scope
         * @returns {} 
         */
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }

    /** 
     * Renderable entity 
     */
    export interface IRenderable {
        /**
		* Renders whole element to string using templates provider
		*
		* @param templatesProvider Cached templates provider
		* @returns String containing HTML code for element
		*/
        renderElement?: (templatesProvider: ITemplatesProvider) => string;
        /**
		* Renders element to HTML string using templates provider
		*
		* @param templatesProvider Cached templates provider
		* @returns String containing HTML code for element
		*/
        renderContent?: (templatesProvider: ITemplatesProvider) => string;
    }

    /** 
     * Cell object 
     */
    export interface ICell extends IRenderable {
        /** 
         * Associated row
         */
        Row: IRow;
        /** 
         * Associated column
         */
        Column: IColumn;
        /** 
         * Data for this specific cell
         */
        Data: any;
        /** 
         * Whole data object associated with this specific cell 
         */
        DataObject: any;
        /**
         * Overriden Template ID for cell
         */
        TemplateIdOverride?: string;

        /**
         * Is cell updated or not
         */
        IsUpdated?: boolean;

        /**
         * Does cell belong to an added row in case of parsering update result
         */
        IsAdded?: boolean;

        /**
         * Flag to note that this row was selected by user
         */
        IsSelected?: boolean;
    }

    /**
     * Colun header rendering object
     */
    export interface IColumnHeader extends IRenderable {
        /**
         * Reference to containing column
         */
        Column: IColumn;
        /**
         * Overriden Template ID for header
         */
        TemplateIdOverride?: string;
    }

    /** 
     * Row object
     */
    export interface IRow extends IRenderable {
        /** 
         * Data object for row 
         */
        DataObject: any;
        /** 
         * Displaying index. 
         * You can obtain data for this particular row from DataHolderService 
         * using localLookupDisplayedData method
         */
        Index: number;
        /** 
         * Reference to table object this row belongs to
         */
        MasterTable: IMasterTable;

        /**
         * Cells collection for this particular row
         */
        Cells: { [key: string]: ICell };

        /**
         * Special rows are bein added automatically. 
         * This mark denotes them to avoid confusion
         */
        IsSpecial?: boolean;

        /**
         * Overriden Template ID for row
         */
        TemplateIdOverride?: string;

        /**
         * Flag to note that this row was selected by user
         */
        IsSelected?: boolean;

        /**
         * Is cell updated or not
         */
        IsUpdated?: boolean;

        /**
         * Does cell belong to an added row in case of parsering update result
         */
        IsAdded?: boolean;

        /**
         * True when row can be selected, false otherwise
         */
        CanBeSelected?: boolean;
    }

    export interface ITemplatesProvider {
        /** 
         * Current handlebars.js engine instance 
         */
        HandlebarsInstance: Handlebars.IHandlebars;
        /**
		* Retrieves cached template handlebars function
		*
		* @param templateId Template id
		* @returns Handlebars function
		*/
        getCachedTemplate(templateId: string): (arg: any) => string;

        /**
         * Determines whether template id is present and cached
         * 
         * @param templateId 
         * @returns {} 
         */
        hasCachedTemplate(templateId: string): boolean;
    }

    export interface IColumn {
        /** 
         *Raw column name 
         */
        RawName: string;
        /** 
         * Column configuration 
         */
        Configuration: Configuration.Json.IColumnConfiguration;
        /** 
         * Reference to master table 
         */
        MasterTable: IMasterTable;
        /** 
         * Column header 
         */
        Header: IColumnHeader;
        /** 
         * Column order (left-to-right) 
         */
        Order: number;

        /** 
         * Column order (left-to-right) 
         */
        UiOrder: number;

        /**
         * True when column holds DateTime values
         */
        IsDateTime: boolean;

        /**
         * True when column holds Integer numbers
         */
        IsInteger: boolean;

        /**
         * True when column holds floating point
         */
        IsFloat: boolean;

        /**
         * True when column holds strings
         */
        IsString: boolean;

        /**
         * True when column holds enum values
         */
        IsEnum: boolean;

        /**
         * True when column holds boolean
         */
        IsBoolean: boolean;
    }

    export interface IUiMessage extends ITableMessage {
        UiColumnsCount: number;
        IsMessageObject?: boolean;
    }

    export interface IEditValidationEvent {
        OriginalDataObject: any;
        ModifiedDataObject: any;
        ValidationMessages: PowerTables.Editing.IValidationMessage[];
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

    export interface IRowEventArgs {
        /**
         * Master table reference
         */
        Master: IMasterTable;

        /**
         * Original event reference
         */
        OriginalEvent: Event;

        /**
         * Row index. 
         * Data object can be restored using Table.DataHolderService.localLookupDisplayedData(RowIndex)
         */
        Row: number;

        /**
         * Stops event propagation
         */
        Stop: boolean;
    }

    /**
     * Event arguments for particular cell event
     */
    export interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column index related to particular cell. 
         * Column object can be restored using Table.InstanceManagerService.getUiColumns()[ColumnIndex]
         */
        Column: number;
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

        filter?: { [key: string]: any };
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

    export interface IAdjustmentResult {
        NeedRedrawAllVisible: boolean;
        VisiblesToRedraw: any[];
        AddedData: any[];
        TouchedData: any[];
        TouchedColumns: string[][];
    }

    /**
     * Result of searching among local data
     */
    export interface ILocalLookupResult {
        /**
         * Data object reference itself
         */
        DataObject: any;

        /**
         * Is data object currently displaying or not
         */
        IsCurrentlyDisplaying: boolean;

        /**
         * Row index among loaded data
         */
        LoadedIndex: number;

        /**
         * Row index among displayed data
         */
        DisplayedIndex: number;
    }

    /**
     * Interface for component that receives and handles additional data that came with 
     * particular response
     */
    export interface IAdditionalDataReceiver {
        /**
         * Method for handling additional data request
         * 
         * @param additionalData Additional data object
         * @returns {} 
         */
        handleAdditionalData(additionalData: any): void;
    }

    /**
     * Command execution parameters
     */
    export interface ICommandExecutionParameters {

        /**
         * Reference to command description
         */
        CommandDescription: PowerTables.Commands.ICommandDescription;

        /**
         * Reference to master table
         */
        Master: IMasterTable,

        /**
         * Command subject (if any)
         * Object that command was triggered on
         */
        Subject: any;

        /**
         * Selection objects
         */
        Selection: any[];

        /**
         * Confirmation object (if any)
         * This field might be null when command confirmation has not been obtained yet
         */
        Confirmation: any;

        /**
         * Command execution result
         */
        Result: any;

        confirm: () => void;
        dismiss: () => void;

        Details: any;
    }

    export interface IAdditionalRowsProvider {
        provide(rows:IRow[]):void;
    }

    export interface IPartitionChangeEventArgs {
        PreviousSkip: number;
        PreviousTake: number;
        Skip: number;
        Take:number;
    }
}