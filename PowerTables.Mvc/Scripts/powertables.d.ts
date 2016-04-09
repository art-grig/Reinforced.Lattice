/// <reference path="../../PowerTables.Script/Scripts/PowerTables/ExternalTypings.d.ts" />
declare module PowerTables {
    /** Renderable entity */
    interface IRenderable {
        /**
        * Renders whole element to string using templates provider
        *
        * @param templatesProvider Cached templates provider
        * @returns String containing HTML code for element
        */
        renderElement(templatesProvider: PowerTables.ITemplatesProvider): string;
        /**
        * Renders element to HTML string using templates provider
        *
        * @param templatesProvider Cached templates provider
        * @returns String containing HTML code for element
        */
        renderContent(templatesProvider: PowerTables.ITemplatesProvider): string;
    }
    /** Cell object */
    interface ICell extends PowerTables.IRenderable {
        /** Associated row */
        Row: PowerTables.IRow;
        /** Associated column */
        Column: PowerTables.IColumn;
        /** Data for this specific cell */
        Data: any;
        /** Whole data object associated with this specific cell */
        DataObject: any;
    }
    /**
    * Interface of checkboxify plugin.
    *             Plugin id is "Checkboxify"
    */
    interface ICheckboxifyPlugin {
        /**
        * Retrieves array of checked items ids
        *
        * @param _
        * @returns Array of ids
        */
        getSelection(): string[];
        /**
        * Selects or deselects all elements based on parameter
        *
        * @param select When true, all elements will be selected. No ones otherwise
        */
        selectAll(select: boolean): void;
        /**
        * Resets all the table selection
        *
        * @param _
        */
        resetSelection(): void;
        /**
        * Selects or deselects item with specified Id
        *
        * @param itemId Item Id to select
        * @param selected True to select, false to reset selection
        */
        selectItem(itemId: string, selected: boolean): void;
    }
    interface IColumn {
        /** Raw column name */
        RawName: string;
        /** Column configuration */
        Configuration: PowerTables.Configuration.Json.IColumnConfiguration;
        /** Reference to master table */
        MasterTable: any;
        /** Column header */
        Header: PowerTables.IColumnHeader;
        /** Column order (left-to-right) */
        Order: number;
    }
    interface IColumnHeader extends PowerTables.IRenderable {
        Column: PowerTables.IColumn;
    }
    interface ITemplatesProvider {
        /** Current handlebars.js engine instance */
        HandlebarsInstance: any;
        /**
        * Retrieves cached template handlebars function
        *
        * @param templateId Template id
        * @returns Handlebars function
        */
        getCachedTemplate(templateId: string): (arg: any) => string;
    }
    /** Row object */
    interface IRow extends PowerTables.IRenderable {
        /** Data object for row */
        DataObject: any;
        /** Zero-based row idnex */
        Index: number;
        /** Table reference */
        MasterTable: any;
        Cells: {
            [key: string]: PowerTables.ICell;
        };
    }
    /**
    * The respons that is being sent to client script.
    *             This entity contains query results to be shown in table and also additional data
    */
    interface IPowerTablesResponse {
        /** Total results count */
        ResultsCount: number;
        /** Current data page index */
        PageIndex: number;
        /**
        * Data itself (array of properties in order as declared for each object.
        *             <example>E.g.: if source table is class User { string Id; string Name } then this field should present resulting query in a following way: [User1.Id, User1.Name,User2.Id, User2.Name ...] etc</example>
        */
        Data: any[];
        /**
        * Additional data being serialized for client.
        *             This field could contain anything that will be parsed on client side and corresponding actions will be performed.
        *             See <see cref="T:PowerTables.ResponseProcessing.IResponseModifier" />
        */
        AdditionalData: {
            [key: string]: any;
        };
        /** Query succeeded: true/false */
        Success: boolean;
        /** Error message if not sucess */
        Message: string;
    }
    /** Data request constructed in Javascript, passed to server and extracted from ControllerContext */
    interface IPowerTableRequest {
        /** Command (default is "query") */
        Command: string;
        /** Data query itself */
        Query: PowerTables.IQuery;
    }
    /** Data query (part of request) */
    interface IQuery {
        /** Paging information */
        Paging: PowerTables.IPaging;
        /** Ordering information. Key = column name, Ordering = ordering */
        Orderings: {
            [key: string]: PowerTables.Ordering;
        };
        /** Filtering arguments. Key = column name, Value = filter argument */
        Filterings: {
            [key: string]: string;
        };
        /** Additional data. Random KV object */
        AdditionalData: {
            [key: string]: string;
        };
        /** Static data extractable via PowerTablesHandler */
        StaticDataJson: string;
    }
    /** Paging information */
    interface IPaging {
        /** Required page index */
        PageIndex: number;
        /** Required page size */
        PageSize: number;
    }
    /** Ordering */
    enum Ordering {
        /** Ascending */
        Ascending = 0,
        /** Descending */
        Descending = 1,
        /** Ordering is not applied */
        Neutral = 2,
    }
}
declare module PowerTables.Configuration.Json {
    /** Configuration JSON object for whole table */
    interface ITableConfiguration {
        /** Templates prefix. It is used to distinguish several templates sets on single page from each other */
        Prefix: string;
        /** Root ID */
        TableRootId: string;
        /** URL for table requests (relative to website root) */
        OperationalAjaxUrl: string;
        /** When true, table data will be loaded immediately after initialization */
        LoadImmediately: boolean;
        /** DateTime format used on server to parse dates from client */
        ServerDateTimeFormat: string;
        /** JS-Date format used as literal on client-side */
        ClientDateTimeFormat: string;
        /** Function that turns input element to datapicker */
        DatePickerFunction: (e: any, format: string) => void;
        /** Table columns */
        Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
        /** Custom plugins configuration. Key: pluginId, Value: configuration */
        PluginsConfiguration: {
            [key: string]: PowerTables.Configuration.Json.IPluginConfiguration;
        };
        /** Static data that will be embedded into table and sent within each request */
        StaticData: string;
    }
    /** Table column JSON configuration */
    interface IColumnConfiguration {
        /** Column title */
        Title: string;
        /** Raw column name */
        RawColumnName: string;
        /** Handlebars template ID for rendering */
        CellRenderingTemplateId: string;
        /**
        * Inline JS function that takes table row data object (TTableData) and
        *             turns it into HTML content that will be placed inside wrapper
        */
        CellRenderingValueFunction: (a: any) => string;
        /** CLR column type */
        ColumnType: string;
        /** Is column data-only (never being displayed actually) */
        IsDataOnly: boolean;
    }
    /** Plugin JSON configuration */
    interface IPluginConfiguration {
        /** Plugin ID */
        PluginId: string;
        /** Plugin placement */
        Placement: string;
        /** Plugin configuration itself */
        Configuration: any;
    }
}
declare module PowerTables.Plugins.Checkboxify {
    /**
    * Client configuration for Checkboxify plugin.
    *             See <see cref="T:PowerTables.Plugins.Checkboxify.CheckboxifyExtensions" />
    */
    interface ICheckboxifyClientConfig {
        SelectionColumnName: string;
        ResetOnReload: boolean;
        EnableSelectAll: boolean;
        SelectAllSelectsUndisplayedData: boolean;
        SelectedRowClass: string;
        SelectAllOnlyIfAllData: boolean;
        CheckboxifyColumnName: string;
        SelectAllLocation: PowerTables.Plugins.Checkboxify.SelectAllLocation;
    }
    enum SelectAllLocation {
        FiltersHeader = 0,
        ColumnHeader = 1,
    }
}
declare module PowerTables.Plugins.Formwatch {
    interface IFormwatchClientConfiguration {
        FieldsConfiguration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
    }
    interface IFormwatchFieldData {
        FieldJsonName: string;
        FieldSelector: string;
        FieldValueFunction: () => any;
        TriggerSearchOnEvents: string[];
        ConstantValue: string;
        SearchTriggerDelay: number;
        SetConstantIfNotSupplied: boolean;
    }
}
declare module PowerTables.Plugins.Hideout {
    /**
    * Client configuration for Hideout plugin.
    *             See <see cref="T:PowerTables.Plugins.Hideout.HideoutExtensions" />
    */
    interface IHideoutClientConfiguration {
        ShowMenu: boolean;
        HidebleColumnsNames: string[];
        ReloadTableOnChangeHidden: boolean;
    }
}
declare module PowerTables.Filters.Range {
    /** UI configuration for range filterr */
    interface IRangeFilterUiConfig {
        /** Place holder for "From" field */
        FromPlaceholder: string;
        /** Placeholder for "To" field */
        ToPlaceholder: string;
        /** Delay between field change and request processing begins */
        InputDelay: number;
        /** "From" box preselected value */
        FromValue: string;
        /** "To" box preselected value */
        ToValue: string;
    }
}
declare module PowerTables.Filters.Value {
    /** UI configuration for value filter */
    interface IValueFilterUiConfig {
        /** Placeholder text */
        Placeholder: string;
        /** Delay between field change and request processing begins */
        InputDelay: number;
        /** Preselected value */
        DefaultValue: string;
    }
}
declare module PowerTables.Plugins.ResponseInfo {
    interface IResponseInfoClientConfiguration {
        /** Use handlebars syntax with IResponse as context */
        TemplateText: string;
        ResponseObjectOverride: boolean;
    }
}
declare module System.Web.Mvc {
    interface ISelectListItem {
        Disabled: boolean;
        Selected: boolean;
        Text: string;
        Value: string;
    }
}
declare module PowerTables.Filters.Select {
    /** UI configuration for select filter */
    interface ISelectFilterUiConfig {
        /** Preselected filter value */
        SelectedValue: string;
        /** When true, option to select "Any" entry will be added to filter */
        AllowSelectNothing: boolean;
        /** When true, ability to select multiple possible values will be available */
        IsMultiple: boolean;
        /** Text for "Any" select option */
        NothingText: string;
        /** Select filter value list */
        Items: System.Web.Mvc.ISelectListItem[];
    }
}
declare module PowerTables.Plugins.Limit {
    /**
    * Client configuration for Limit plugin.
    *             See <see cref="T:PowerTables.Plugins.Limit.LimitPluginExtensions" />
    */
    interface ILimitClientConfiguration {
        DefaultValue: string;
        LimitValues: number[];
        LimitLabels: string[];
        ReloadTableOnLimitChange: boolean;
    }
}
declare module PowerTables.Plugins.Ordering {
    /**
    * Client per-column configuration for ordering.
    *             See <see cref="T:PowerTables.Plugins.Ordering.OrderingExtensions" />
    */
    interface IOrderingConfiguration {
        /** Default orderings for columns. Key - column RawName, Value - ordering direction */
        DefaultOrderingsForColumns: {
            [key: string]: PowerTables.Ordering;
        };
    }
}
declare module PowerTables.Plugins.Paging {
    /**
    * Client configuration for Paging plugin.
    *             See <see cref="T:PowerTables.Plugins.Paging.PagingExtensions" />
    */
    interface IPagingClientConfiguration {
        ArrowsMode: boolean;
        PreviousText: string;
        NextText: string;
        UsePeriods: boolean;
        PagesToHideUnderPeriod: number;
        UseFirstLastPage: boolean;
        UseGotoPage: boolean;
    }
}
declare module PowerTables.Plugins.Toolbar {
    interface IToolbarButtonsClientConfiguration {
        Buttons: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
    }
    interface IToolbarButtonClientConfiguration {
        Id: string;
        Css: string;
        Style: string;
        HtmlContent: string;
        Command: string;
        BlackoutWhileCommand: boolean;
        DisableIfNothingChecked: boolean;
        Title: string;
        /** Function (table:PowerTables.PowerTable, response:IPowerTablesResponse) =&gt; void */
        CommandCallbackFunction: (table: any, response: IPowerTablesResponse) => void;
        /** Function (continuation: ( queryModifier?:(a:IQuery) =&gt; IQuery ) =&gt; void ) =&gt; void */
        ConfirmationFunction: (continuation: (queryModifier?: (a: IQuery) => void) => void) => void;
        /** Function (table:any (PowerTables.PowerTable), menuElement:any)=&gt;void */
        OnClick: (table: any, menuElement: any) => void;
        Submenu: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
        HasSubmenu: boolean;
        IsMenu: boolean;
        Separator: boolean;
        TempId: string;
    }
}
declare module PowerTables.Plugins.Total {
    interface ITotalResponse {
        TotalsForColumns: {
            [key: string]: string;
        };
    }
    interface ITotalClientConfiguration {
        ShowOnTop: boolean;
        ColumnsValueFunctions: {
            [key: string]: (a: any) => string;
        };
    }
}
declare module PowerTables {
    /**
     * Component responsible for handling of user events raised on table cells
     */
    class CellEventDelegator {
        constructor(bodyRootElement: HTMLElement);
        private _bodyRootElement;
    }
}
declare module PowerTables {
    /**
     * Components container for registration/resolving plugins
     */
    class ComponentsContainer {
        private static _components;
        /**
         * Registers component in components container for further instantiation
         * @param key Text ID for component
         * @param ctor Constructor function
         * @returns {}
         */
        static registerComponent(key: string, ctor: Function): void;
        /**
         * Instantiates component by its ID with specified arguments
         * @param key Text ID of desired component
         * @param args String arguments for instantiation
         * @returns {}
         */
        static resolveComponent<T>(key: string, args?: any[]): T;
    }
}
declare module PowerTables {
    /**
     * This entity is responsible for integration of data between storage and rendere.
     * Also it provides functionality for table events subscription and
     * elements location
     */
    class Controller {
        private _masterTable;
        private _rootSelector;
        /**
         * Initializes full reloading cycle
         * @returns {}
         */
        reload(): void;
        private redrawCurrentlyDisplayingObjects();
        subscribeCellEvent(eventId: string, selector: string, subscriptionId: string, handler: (e: ICellEventArgs) => any): void;
        subscribeRowEvent(eventId: string, selector: string, subscriptionId: string, handler: (e: ICellEventArgs) => any): void;
        insertLocalRow(object: any, index: number): void;
        deleteLocalRow(index: number): void;
        updateLocalRow(index: number, updateFn: (object: any) => void): void;
        produceRow(dataObject: any, columns: IColumn[], idx: number): IRow;
        private produceRows();
    }
    /**
     * Event arguments for particular cell event
     */
    interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column related to particular cell
         */
        Column: IColumn;
    }
    interface IRowEventArgs {
        /**
        * Master table reference
        */
        Table: IMasterTable;
        /**
         * Cell data object
         */
        DataObject: any;
        /**
         * Original event reference
         */
        OriginalEvent: Event;
        /**
         * Row index
         */
        Index: number;
    }
}
declare module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    /**
     * Client filter interface.
     * This interface is registerable in the DataHolder as
     * one of the part of filtering pipeline
     */
    interface IClientFilter {
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
     * Interface for modifying of source data set on client side
     */
    interface IClientTruncator {
        /**
         * This method should consume source
         * data set and produce resulting set.
         * Here you can truncate results e.g. apply paging.
         *
         * By technical reasons it can be only one client selector registered on table.
         *
         *
         * @param sourceDataSet Array of data objects received from server
         * @param query Data query
         */
        selectData(sourceDataSet: any[], query: IQuery): any[];
    }
    /**
     * Plugin interface.
     * Leave both render functions null to obtain non-displaying plugin
     */
    interface IPlugin extends IRenderable {
        /**
         * Raw configuration object including Plugin Id
         */
        Configuration: PluginConfiguration;
        /**
         * Plugin Id including placement
         */
        PluginLocation: string;
        /**
         * Beginning of plugin lifecycle
         *
         * @param masterTable
         * @param configuration
         */
        init(masterTable: IMasterTable, configuration: PluginConfiguration): void;
    }
    /**
     * Main table interface for breaking additional dependencies
     */
    interface IMasterTable {
        /**
        * API for raising and handling various table events
        */
        Events: EventsManager;
        /**
         * API for managing local data
         */
        DataHolder: DataHolder;
        /**
         * API for data loading
         */
        Loader: Loader;
        /**
         * API for rendering functionality
         */
        Renderer: Rendering.Renderer;
        /**
         * API for locating instances of different components
         */
        InstanceManager: InstanceManager;
    }
    /**
     * This enumeration distinguishes which way
     * underlying query will be used
     */
    enum QueryScope {
        /**
         * Mentioned query will be sent to server to obtain
         * data (probably) for further local filtration.
         * All locally filtered fields should be excluded from
         * underlying query
         */
        Server = 0,
        /**
         * Mentioned query will be used for local data filtration.
         * To gain performance, please exclude all data settings that were
         * applied during server request
         */
        Client = 1,
        /**
         * This query should contain both data for client and server filtering.
         * Transboundary queries are used to obtain query settings
         * that will be used on server side to retrieve data set that
         * will be used for server command handling, so server needs all filtering settings
         */
        Transboundary = 2,
    }
    /**
     * Interface for classes that are available to modify data query
     */
    interface IQueryPartProvider {
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
        modifyQuery(query: PowerTables.IQuery, scope: QueryScope): void;
    }
}
declare module PowerTables {
    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    class DataHolder {
        constructor(rawColumnNames: string[], isColumnDateTimeFunc: (s: string) => boolean, events: EventsManager, instances: InstanceManager);
        private _rawColumnNames;
        private _isColumnDateTimeFunc;
        private _comparators;
        private _filters;
        private _anyClientFiltration;
        private _events;
        private _instances;
        /**
         * Data that actually is currently displayed in table
         */
        CurrentlyDisplaying: any[];
        /**
         * Data that was recently loaded from server
         */
        LastLoaded: any[];
        /**
         * Selector of source data on client-side
         */
        Selector: IClientTruncator;
        /**
         * Registers client filter
         *
         * @param filter Client filter
         */
        registerClientFilter(filter: IClientFilter): void;
        /**
         * Registers new client ordering comparer function
         *
         * @param dataField Field for which this comparator is applicable
         * @param comparator Comparator fn that should return 0 if entries are equal, -1 if a<b, +1 if a>b
         * @returns {}
         */
        registerClientOrdering(dataField: string, comparator: (a: any, b: any) => number): void;
        /**
         * Is there any client filtration pending
         * @returns True if there are any actions to be performed on query after loading, false otherwise
         */
        isClientFiltrationPending(): boolean;
        /**
        * Parses response from server and turns it to objects array
        */
        storeResponse(response: IPowerTablesResponse, clientQuery: IQuery): void;
        private _recentClientQuery;
        private filterSet(objects, query);
        private orderSet(objects, query);
        /**
         * Filter recent data and store it to currently displaying data
         *
         * @param query Table query
         * @returns {}
         */
        filterRecentData(query: IQuery): void;
        /**
         * Finds data matching predicate among locally stored data
         *
         * @param predicate Filtering predicate returning true for required objects
         * @returns Array of ILocalLookupResults
         */
        localLookup(predicate: (object: any) => boolean): ILocalLookupResult[];
        /**
         * Finds data object among currently displayed and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        localLookupCurrentlyDisplaying(index: number): ILocalLookupResult;
        /**
         * Finds data object among recently loaded and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        localLookupLoaded(index: number): ILocalLookupResult;
    }
    /**
     * Result of searching among local data
     */
    interface ILocalLookupResult {
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
}
declare module PowerTables {
    /**
     * Wrapper for table event with ability to subscribe/unsubscribe
     */
    class TableEvent<TEventArgs> {
        constructor(masterTable: any);
        private _masterTable;
        private _handlers;
        /**
         * Invokes event with overridden this arg and specified event args
         *
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        invoke(thisArg: any, eventArgs: TEventArgs): void;
        /**
         * Subscribes specified function to event with supplied string key.
         * Subscriber key is needed to have an ability to unsubscribe from event
         * and should reflect entity that has been subscriben
         *
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        subscribe(handler: (e: ITableEventArgs<TEventArgs>) => any, subscriber: string): void;
        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        unsubscribe(subscriber: string): void;
    }
    /**
     * Events manager for table.
     * Contains all available events
     */
    class EventsManager {
        private _masterTable;
        constructor(masterTable: any);
        /**
         * "Before Filter Gathering" event.
         * Occurs every time before sending request to server via Loader before
         * filtering information is being gathered. Here you can add your own
         * additional data to prepared query that will be probably overridden by
         * other query providers.
         */
        BeforeQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        /**
         * "After Filter Gathering" event.
         * Occurs every time before sending request to server via Loader AFTER
         * filtering information is being gathered. Here you can add your own
         * additional data to prepared query that will probably override parameters
         * set by another query providers.
         */
        AfterQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        /**
         * "Before Loading" event.
         * Occurs every time right before calling XMLHttpRequest.send and
         * passing gathered filters to server
         */
        BeforeLoading: TableEvent<ILoadingEventArgs>;
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
        DeferredDataReceived: TableEvent<IDeferredDataEventArgs>;
        /**
         * "Loading Error" event.
         * Occurs every time when Loader encounters loading error.
         * It may be caused by server error or network (XMLHttp) error.
         * Anyway, error text/cause/stacktrace will be supplied as Reason
         * field of event args
         */
        LoadingError: TableEvent<ILoadingErrorEventArgs>;
        /**
         * "Columns Creation" event.
         * Occurs when full columns list formed and available for
         * modifying. Addition/removal/columns modification is acceptable
         */
        ColumnsCreation: TableEvent<{
            [key: string]: IColumn;
        }>;
        /**
         * "Data Received" event.
         * Occurs EVERY time when something is being received from server side.
         * Event argument is deserialized JSON data from server.
         */
        DataReceived: TableEvent<IDataEventArgs>;
        /**
         * "After Loading" event.
         * Occurs every time after EVERY operation connected to server response handling
         * has been finished
         */
        AfterLoading: TableEvent<ILoadingEventArgs>;
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
        registerEvent<TEventArgs>(eventName: string): void;
    }
    /**
     * Event args wrapper for table
     */
    interface ITableEventArgs<T> {
        /**
         * Reverence to master table
         */
        MasterTable: any;
        /**
         * Event arguments
         */
        EventArgs: T;
    }
    /**
     * Event args for loading events
     */
    interface ILoadingEventArgs {
        /**
         * Query to be sent to server
         */
        Request: IPowerTableRequest;
        /**
         * Request object to be used while sending to server
         */
        XMLHttp: XMLHttpRequest;
    }
    /**
     * Event args for loading error event
     */
    interface ILoadingErrorEventArgs extends ILoadingEventArgs {
        /**
         * Error text
         */
        Reason: string;
    }
    /**
     * Event args for deferred data received event
     */
    interface IDeferredDataEventArgs extends ILoadingEventArgs {
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
    interface IDataEventArgs extends ILoadingEventArgs {
        /**
         * Deserialized JSON data that is received from server
         */
        Data: any;
    }
    /**
     * Event args for query gathering process
     */
    interface IQueryGatheringEventArgs {
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
declare module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration;
    /**
     * This thing is used to manage instances of columns, plugins etc.
     * It consumes PT configuration as source and provides caller with
     * plugins instances, variable ways to query them and accessing their properties
     */
    class InstanceManager {
        constructor(configuration: Configuration.Json.ITableConfiguration, masterTable: IMasterTable, events: EventsManager);
        /**
         * Dictionary containing current table columns configurations.
         * Key - raw column name. Value - IColumn instance
         */
        Columns: {
            [key: string]: IColumn;
        };
        /**
         * Dictionary containing all instances of table plugins.
         * Key - full plugin ID (incl. placement). Value - plugin itself
         */
        Plugins: {
            [key: string]: IPlugin;
        };
        /**
         * Events manager
         */
        private _events;
        /**
         * Table configuration
         */
        Configuration: TableConfiguration;
        private _rawColumnNames;
        private _masterTable;
        private initColumns();
        private initPlugins();
        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID
         * @param placement Pluign placement
         * @returns {}
         */
        getPlugin(pluginId: string, placement?: string): IPlugin;
        /**
         * Retrieves plugins list at specific placement
         *
         * @param placement Plugins placement
         * @returns {}
         */
        getPlugins(placement: string): IPlugin[];
        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID
         * @param placement Pluign placement
         * @returns {}
         */
        getColumnFilter<TPlugin>(columnName: string): TPlugin;
        /**
         * Determines is column of DateTime type or not
         * @param columnName Column name
         * @returns {}
         */
        isDateTime(columnName: string): boolean;
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        getColumnNames(): string[];
        /**
         * Retreives columns suitable for UI rendering in corresponding order
         *
         * @returns {}
         */
        getUiColumns(): IColumn[];
        /**
         * Retrieves column by its raw name
         *
         * @param columnName Raw column name
         * @returns {}
         */
        getColumn(columnName: string): IColumn;
    }
}
declare module PowerTables {
    /**
     * Component that is responsible for querying server
     */
    class Loader {
        constructor(staticData: any, operationalAjaxUrl: string, events: EventsManager, dataHolder: DataHolder);
        private _queryPartProviders;
        private _previousRequest;
        private _staticData;
        private _operationalAjaxUrl;
        private _events;
        private _dataHolder;
        private _isFirstTimeLoading;
        /**
         * Registers new query part provider to be used while collecting
         * query data before sending it to server.
         *
         * @param provider instance implementing IQueryPartProvider interface
         * @returns {}
         */
        registerQueryPartProvider(provider: IQueryPartProvider): void;
        private gatherQuery(queryScope);
        private getXmlHttp();
        private _previousQueryString;
        private doServerQuery(data, clientQuery, callback);
        /**
         * Sends specified request to server and lets table handle it.
         * Always use this method to invoke table's server functionality because this method
         * correctly rises all events, handles errors etc
         *
         * @param command Query command
         * @param callback Callback that will be invoked after data received
         * @param queryModifier Inline query modifier for in-place query modification
         * @returns {}
         */
        requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery): void;
    }
}
declare module PowerTables {
    /**
     * Base class for creating new plugins
     */
    class PluginBase<TConfiguration> implements IPlugin {
        init(masterTable: IMasterTable, configuration: PowerTables.Configuration.Json.IPluginConfiguration): void;
        renderElement(templatesProvider: ITemplatesProvider): string;
        renderContent(templatesProvider: ITemplatesProvider): string;
        Configuration: PowerTables.Configuration.Json.IPluginConfiguration;
        PluginLocation: string;
    }
}
declare module PowerTables {
    import TableConfiguration = PowerTables.Configuration.Json.ITableConfiguration;
    class PowerTable implements IMasterTable {
        constructor(configuration: TableConfiguration);
        private _isReady;
        private bindReady();
        private _configuration;
        private initialize();
        /**
         * API for raising and handling various table events
         */
        Events: EventsManager;
        /**
         * API for managing local data
         */
        DataHolder: DataHolder;
        /**
         * API for data loading
         */
        Loader: Loader;
        /**
         * API for rendering functionality
         */
        Renderer: Rendering.Renderer;
        /**
         * API for locating instances of different components
         */
        InstanceManager: InstanceManager;
        /**
         * API for overall workflow controlling
         */
        Controller: Controller;
    }
}
declare module PowerTables.Rendering {
    /**
     * Part of renderer that is responsible for rendering of dynamically loaded content
     */
    class ContentRenderer {
        constructor(templatesProvider: ITemplatesProvider, stack: PowerTables.Rendering.RenderingStack, instances: InstanceManager);
        private _hb;
        private _templatesProvider;
        private _columnsRenderFunctions;
        private _stack;
        private _instances;
        /**
         * Renders supplied table rows to string
         *
         * @param rows Table rows
         * @returns String containing HTML of table rows
         */
        renderBody(rows: IRow[]): string;
        renderContent(columnName?: string): string;
        private cacheColumnRenderers(columns);
    }
}
declare module PowerTables.Rendering {
    /**
     * This module allows you to locate particular elements in table's DOM
     */
    class DOMLocator {
        constructor(bodyElement: HTMLElement, rootElement: HTMLElement, rootId: string);
        private _bodyElement;
        private _rootElement;
        private _rootIdPrefix;
        /**
         * Retrieves cell element from supplied body
         *
         * @param cell Cell element
         * @returns {}
         */
        getCellElement(cell: ICell): HTMLElement;
        /**
         * Retrieves row element (including wrapper)
         *
         * @param row Row
         * @returns HTML element
         */
        getRowElement(row: IRow): HTMLElement;
        /**
         * Retrieves data cells for specified column (including wrappers)
         *
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        getColumnCellsElements(column: IColumn): NodeList;
        /**
         * Retrieves data cells for whole row (including wrapper)
         *
         * @param row Row with data cells
         * @returns NodeList containing results
         */
        getRowCellsElements(row: IRow): NodeList;
        /**
         * Retrieves data cells for whole row (including wrapper)
         *
         * @param row Row with data cells
         * @returns NodeList containing results
         */
        getRowCellsElementsByIndex(rowDisplayingIndex: number): NodeList;
        /**
         * Retrieves HTML element for column header (including wrapper)
         *
         * @param header Column header
         * @returns HTML element
         */
        getHeaderElement(header: IColumnHeader): HTMLElement;
        /**
         * Retrieves HTML element for plugin (including wrapper)
         *
         * @param plugin Plugin
         * @returns HTML element
         */
        getPluginElement(plugin: IPlugin): HTMLElement;
    }
}
declare module PowerTables.Rendering {
    /**
    * Helper class for producing track ids
    */
    class TrackHelper {
        static getCellTrack(cell: ICell): string;
        static getCellTrackByIndexes(rowIndex: number, columnIndex: number): string;
        static getPluginTrack(plugin: IPlugin): string;
        static getPluginTrackByLocation(pluginLocation: string): string;
        static getHeaderTrack(header: IColumnHeader): string;
        static getHeaderTrackByColumnName(columnName: string): string;
        static getRowTrack(row: IRow): string;
        static getRowTrackByIndex(index: number): string;
    }
}
declare module PowerTables.Rendering {
    /**
     * Rendering stack class. Provives common helper
     * infrastructure for context-oriented rendering
     */
    class RenderingStack {
        private _contextStack;
        /**
         * Clears rendering stack
         * @returns {}
         */
        clear(): void;
        /**
         * Current rendering context
         */
        Current: IRenderingContext;
        /**
         * Pushes rendering context into stack
         * @param ctx
         * @returns {}
         */
        pushContext(ctx: IRenderingContext): void;
        /**
         * Pushes rendering context into stack
         * @param elementType What is being rendered
         * @param element Reference to object is being rendered
         * @param columnName Optional column name - for column-contexted rendering objects
         * @returns {}
         */
        push(elementType: RenderingContextType, element: IRenderable, columnName?: string): void;
        private getTrack(elementType, element);
        /**
         * Pops rendering context from stack
         * @returns {}
         */
        popContext(): void;
    }
    /**
     * Denotes current rendering context
     */
    interface IRenderingContext {
        /**
         * What is being rendered (Object type)
         */
        Type: RenderingContextType;
        /**
         * Reference to object is being rendered
         */
        Object?: IRenderable;
        /**
         * Optional column name - for column-contexted rendering objects
         */
        ColumnName?: string;
        /**
         * Rendering object track attribute
         */
        CurrentTrack: string;
    }
    /**
     * What renders in current helper method
     */
    enum RenderingContextType {
        /**
         * Plugin (0)
         */
        Plugin = 0,
        /**
         * Column header (1)
         */
        Header = 1,
        /**
         * Row (containing cells) (2)
         */
        Row = 2,
        /**
         * Cell (belonging to row and column) (3)
         */
        Cell = 3,
    }
}
declare module PowerTables.Rendering {
    /**
     * Layout renderer
     * Is responsive for common layout rendering (with plugins, columns, etc)
     */
    class LayoutRenderer {
        private _instances;
        private _templatesProvider;
        private _hb;
        private _eventsQueue;
        private _stack;
        constructor(templates: ITemplatesProvider, stack: RenderingStack, instances: InstanceManager);
        bindEventsQueue(parentElement: HTMLElement): void;
        private bodyHelper();
        private pluginHelper(pluginPosition, pluginId);
        private pluginsHelper(pluginPosition);
        /**
         * Renders specified plugin into string including its wrapper
         *
         * @param plugin Plugin interface
         * @returns {}
         */
        renderPlugin(plugin: IPlugin): string;
        private headerHelper(columnName);
        private headerHelperInner(column);
        private headersHelper();
        private bindEventHelper(commaSeparatedFunctions, commaSeparatedEvents);
        renderContent(columnName?: string): string;
    }
}
declare module PowerTables.Rendering {
    /**
     * Enity responsible for displaying table
     */
    class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, isColumnDateTimeFunc: (s: string) => boolean, instances: InstanceManager);
        /**
         * Parent element for whole table
         */
        RootElement: HTMLElement;
        /**
         * Parent element for table entries
         */
        BodyElement: HTMLElement;
        /**
        * Current handlebars.js engine instance
        */
        HandlebarsInstance: Handlebars.IHandlebars;
        /**
         * Locator of particular table parts in DOM
         */
        Locator: DOMLocator;
        private _isColumnDateTimeFunc;
        private _instances;
        private _layoutRenderer;
        private _contentRenderer;
        private _stack;
        private _datepickerFunction;
        private _templatesCache;
        private _rootId;
        private cacheTemplates(templatesPrefix);
        /**
         * Retrieves cached template handlebars function
         * @param Template Id
         * @returns Handlebars function
         */
        getCachedTemplate(templateId: string): (arg: any) => string;
        /**
         * Perform table layout inside specified root element
         */
        layout(): void;
        /**
         * Clear dynamically loaded table content and replace it with new one
         *
         * @param rows Set of table rows
         */
        body(rows: IRow[]): void;
        /**
         * Redraws specified plugin refreshing all its graphical state
         *
         * @param plugin Plugin to redraw
         * @returns {}
         */
        redrawPlugin(plugin: IPlugin): void;
        private createElement(html);
        /**
         * Redraws specified row refreshing all its graphical state
         *
         * @param row
         * @returns {}
         */
        redrawRow(row: IRow): void;
        /**
         * Removes all dynamically loaded content in table
         *
         * @returns {}
         */
        clearBody(): void;
        contentHelper(columnName?: string): string;
        private trackHelper();
        private datepickerHelper();
        private ifqHelper(a, b, opts);
    }
}
