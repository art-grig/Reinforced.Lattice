/// <reference path="../../PowerTables.Script/Scripts/PowerTables/ExternalTypings.d.ts" />
declare module PowerTables.Configuration.Json {
    interface ITableConfiguration {
        EmptyFiltersPlaceholder: string;
        Prefix: string;
        TableRootId: string;
        OperationalAjaxUrl: string;
        LoadImmediately: boolean;
        DatepickerOptions: PowerTables.IDatepickerOptions;
        Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
        PluginsConfiguration: PowerTables.Configuration.Json.IPluginConfiguration[];
        StaticData: string;
        CoreTemplates: PowerTables.ICoreTemplateIds;
        KeyFields: string[];
        TouchedCellTemplateId: string;
        TouchedRowTemplateId: string;
        AddedRowTemplateId: string;
    }
    interface IColumnConfiguration {
        Title: string;
        RawColumnName: string;
        CellRenderingTemplateId: string;
        CellRenderingValueFunction: (a: any) => string;
        ColumnType: string;
        IsDataOnly: boolean;
        IsEnum: boolean;
        IsNullable: boolean;
    }
    interface IPluginConfiguration {
        PluginId: string;
        Placement: string;
        Configuration: any;
        Order: number;
        TemplateId: string;
    }
}
declare module PowerTables {
    interface IDatepickerOptions {
        CreateDatePicker: (element: HTMLElement, isNullableDate: boolean) => void;
        PutToDatePicker: (element: HTMLElement, date?: Date) => void;
        GetFromDatePicker: (element: HTMLElement) => Date;
    }
    interface ICoreTemplateIds {
        Layout: string;
        PluginWrapper: string;
        RowWrapper: string;
        CellWrapper: string;
        HeaderWrapper: string;
        Messages: string;
    }
    interface IPowerTablesResponse {
        IsLatticeResponse: boolean;
        ResultsCount: number;
        PageIndex: number;
        Data: any[];
        AdditionalData: {
            [key: string]: any;
        };
        Success: boolean;
        Message: string;
        ExceptionStackTrace: string;
    }
    interface IPowerTableRequest {
        Command: string;
        Query: PowerTables.IQuery;
    }
    interface IQuery {
        Paging: PowerTables.IPaging;
        Orderings: {
            [key: string]: PowerTables.Ordering;
        };
        Filterings: {
            [key: string]: string;
        };
        AdditionalData: {
            [key: string]: string;
        };
        StaticDataJson: string;
    }
    interface IPaging {
        PageIndex: number;
        PageSize: number;
    }
    enum Ordering {
        Ascending = 0,
        Descending = 1,
        Neutral = 2,
    }
}
declare module PowerTables.Plugins.Checkboxify {
    interface ICheckboxifyClientConfig {
        SelectionColumnName: string;
        ResetOnReload: boolean;
        EnableSelectAll: boolean;
        SelectAllSelectsServerUndisplayedData: boolean;
        SelectAllSelectsClientUndisplayedData: boolean;
        SelectAllOnlyIfAllData: boolean;
        ResetOnClientReload: boolean;
        SelectAllTemplateId: string;
        RowTemplateId: string;
        CellTemplateId: string;
    }
}
declare module PowerTables.Plugins.Formwatch {
    interface IFormwatchClientConfiguration {
        DoNotEmbed: boolean;
        FieldsConfiguration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
        FiltersMappings: {
            [key: string]: PowerTables.Plugins.Formwatch.IFormWatchFilteringsMappings;
        };
    }
    interface IFormwatchFieldData {
        FieldJsonName: string;
        FieldSelector: string;
        FieldValueFunction: () => any;
        TriggerSearchOnEvents: string[];
        ConstantValue: string;
        SearchTriggerDelay: number;
        SetConstantIfNotSupplied: boolean;
        AutomaticallyAttachDatepicker: boolean;
        IsDateTime: boolean;
    }
    interface IFormWatchFilteringsMappings {
        FilterType: number;
        FieldKeys: string[];
        ForServer: boolean;
        ForClient: boolean;
    }
}
declare module PowerTables.Plugins.Hideout {
    interface IHideoutPluginConfiguration {
        ShowMenu: boolean;
        HideableColumnsNames: string[];
        ColumnInitiatingReload: string[];
        HiddenColumns: {
            [key: string]: boolean;
        };
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Filters.Range {
    interface IRangeFilterUiConfig {
        ColumnName: string;
        FromPlaceholder: string;
        ToPlaceholder: string;
        InputDelay: number;
        FromValue: string;
        ToValue: string;
        ClientFiltering: boolean;
        ClientFilteringFunction: (object: any, fromValue: string, toValue: string, query: IQuery) => boolean;
        Hidden: boolean;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Filters.Value {
    interface IValueFilterUiConfig {
        Placeholder: string;
        InputDelay: number;
        DefaultValue: string;
        ColumnName: string;
        ClientFiltering: boolean;
        ClientFilteringFunction: (object: any, filterValue: string, query: IQuery) => boolean;
        Hidden: boolean;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.ResponseInfo {
    interface IResponseInfoClientConfiguration {
        ClientEvaluationFunction: (data: IClientDataResults, currentPage: number, totalPages: number) => any;
        ClientTemplateFunction: (data: any) => string;
        ResponseObjectOverriden: boolean;
        DefaultTemplateId: string;
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
    interface ISelectFilterUiConfig {
        SelectedValue: string;
        AllowSelectNothing: boolean;
        IsMultiple: boolean;
        NothingText: string;
        ColumnName: string;
        Items: System.Web.Mvc.ISelectListItem[];
        Hidden: boolean;
        ClientFiltering: boolean;
        ClientFilteringFunction: (object: any, selectedValues: string[], query: IQuery) => boolean;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.Limit {
    interface ILimitClientConfiguration {
        DefaultValue: string;
        LimitValues: number[];
        LimitLabels: string[];
        ReloadTableOnLimitChange: boolean;
        EnableClientLimiting: boolean;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.Ordering {
    interface IOrderingConfiguration {
        DefaultOrderingsForColumns: {
            [key: string]: PowerTables.Ordering;
        };
        ClientSortableColumns: {
            [key: string]: (a: any, b: any) => number;
        };
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.Paging {
    interface IPagingClientConfiguration {
        ArrowsMode: boolean;
        UsePeriods: boolean;
        PagesToHideUnderPeriod: number;
        UseFirstLastPage: boolean;
        UseGotoPage: boolean;
        EnableClientPaging: boolean;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.Toolbar {
    interface IToolbarButtonsClientConfiguration {
        Buttons: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
        DefaultTemplateId: string;
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
        CommandCallbackFunction: (table: any, response: IPowerTablesResponse) => void;
        ConfirmationFunction: (continuation: (queryModifier?: (a: IQuery) => void) => void) => void;
        OnClick: (table: any, menuElement: any) => void;
        Submenu: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
        HasSubmenu: boolean;
        IsMenu: boolean;
        Separator: boolean;
        InternalId: number;
        IsDisabled: boolean;
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
        ColumnsCalculatorFunctions: {
            [key: string]: (data: IClientDataResults) => any;
        };
    }
}
declare module PowerTables.Editors {
    interface ICellEditorUiConfigBase {
        PluginId: string;
        TemplateId: string;
        ValidationMessagesTemplateId: string;
    }
    interface IEditorUiConfig {
        BeginEditEventId: string;
        CommitEventId: string;
        RejectEventId: string;
        EditorsForColumns: {
            [key: string]: PowerTables.Editors.ICellEditorUiConfigBase;
        };
        IntegrityCheckFunction: (dataObject: any) => boolean;
        DeferChanges: boolean;
        EditorType: PowerTables.Editors.EditorType;
    }
    interface IEditionResult {
        ConfirmedObject: any;
        TableAdjustments: PowerTables.Editors.IAdjustmentData;
        OtherTablesAdjustments: {
            [key: string]: PowerTables.Editors.IAdjustmentData;
        };
    }
    interface IAdjustmentData {
        Removals: any[];
        Updates: any[];
    }
    enum EditorType {
        Cell = 0,
        Row = 1,
        Form = 2,
    }
}
declare module PowerTables.Editors.SelectList {
    interface ISelectListEditorUiConfig extends PowerTables.Editors.ICellEditorUiConfigBase {
        PluginId: string;
        SelectListItems: System.Web.Mvc.ISelectListItem[];
        AllowEmptyString: boolean;
        EmptyElementText: string;
        AddEmptyElement: boolean;
    }
}
declare module PowerTables.Editors.Memo {
    interface IMemoEditorUiConfig extends PowerTables.Editors.ICellEditorUiConfigBase {
        PluginId: string;
        WarningChars: number;
        MaxChars: number;
        Rows: number;
        Columns: number;
        AllowEmptyString: boolean;
    }
}
declare module PowerTables.Editors.Check {
    interface ICheckEditorUiConfig extends PowerTables.Editors.ICellEditorUiConfigBase {
        PluginId: string;
        IsMandatory: boolean;
    }
}
declare module PowerTables.Editors.PlainText {
    interface IPlainTextEditorUiConfig extends PowerTables.Editors.ICellEditorUiConfigBase {
        PluginId: string;
        ValidationRegex: string;
        EnableBasicValidation: boolean;
        FormatFunction: (value: any, column: IColumn) => string;
        ParseFunction: (value: string, column: IColumn, errors: PowerTables.Plugins.IValidationMessage[]) => any;
        FloatRemoveSeparatorsRegex: string;
        FloatDotReplaceSeparatorsRegex: string;
        AllowEmptyString: boolean;
        MaxAllowedLength: number;
    }
}
declare module PowerTables.Plugins.LoadingOverlap {
    interface ILoadingOverlapUiConfig {
        OverlapMode: PowerTables.Plugins.LoadingOverlap.OverlapMode;
        DefaultTemplateId: string;
    }
    enum OverlapMode {
        All = 0,
        BodyOnly = 1,
    }
}
declare module PowerTables {
    /**
    * Helper class for producing track ids
    */
    class TrackHelper {
        /**
         * Returns string track ID for cell
         */
        static getCellTrack(cell: ICell): string;
        /**
         * Returns string track ID for cell
         */
        static getCellTrackByIndexes(rowIndex: number, columnIndex: number): string;
        /**
         * Returns string track ID for plugin
         */
        static getPluginTrack(plugin: IPlugin): string;
        /**
         * Returns string track ID for plugin
         */
        static getPluginTrackByLocation(pluginLocation: string): string;
        /**
         * Returns string track ID for header
         */
        static getHeaderTrack(header: IColumnHeader): string;
        /**
         * Returns string track ID for header
         */
        static getHeaderTrackByColumnName(columnName: string): string;
        /**
         * Returns string track ID for row
         */
        static getRowTrack(row: IRow): string;
        /**
         * Returns string track ID for row
         */
        static getRowTrackByIndex(index: number): string;
        /**
         * Parses cell track to retrieve column and row index
         *
         * @param e HTML element containing cell with wrapper
         * @returns {ICellLocation} Cell location
         */
        static getCellLocation(e: HTMLElement): ICellLocation;
        /**
         * Parses row track to retrieve row index
         *
         * @param e HTML element containing row with wrapper
         * @returns {number} Row index
         */
        static getRowIndex(e: HTMLElement): number;
    }
    /**
     * Interface describing cell location
     */
    interface ICellLocation {
        /**
         * Row index
         */
        RowIndex: number;
        /**
         * Column index
         */
        ColumnIndex: number;
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
        /**
         * Registers component-provided events in particular EventsManager instance.
         * It is important to register all component's events befor instantiation and .init call
         * to make them available to subscribe each other's events.
         *
         * Instance manager asserts that .registerEvent will be called exactly once for
         * each component used in table
         *
         * @param key Text ID of desired component
         * @param eventsManager Events manager instance
         * @returns {}
         */
        static registerComponentEvents(key: string, eventsManager: EventsManager, masterTable: IMasterTable): void;
        static registerAllEvents(eventsManager: EventsManager, masterTable: IMasterTable): void;
    }
}
declare module PowerTables {
    import PluginConfiguration = Configuration.Json.IPluginConfiguration;
    import AdjustmentData = PowerTables.Editors.IAdjustmentData;
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
     * Plugin interface.
     * Leave both render functions null to obtain non-displaying plugin
     */
    interface IPlugin extends IRenderable {
        /**
         * Raw configuration object including Plugin Id
         */
        RawConfig: PluginConfiguration;
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
        /**
         * API for overall workflow controlling
         */
        Controller: Controller;
        /**
         * API for working with dates
         */
        Date: DateService;
        /**
         * Absorb and draw table adjustments
         *
         * @param adjustments Table adjustmetns object
         */
        proceedAdjustments(adjustments: AdjustmentData): void;
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
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }
    /** Renderable entity */
    interface IRenderable {
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
    /** Cell object */
    interface ICell extends IRenderable {
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
    }
    /**
     * Colun header rendering object
     */
    interface IColumnHeader extends IRenderable {
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
    interface IRow extends IRenderable {
        /**
         * Data object for row
         */
        DataObject: any;
        /**
         * Displaying index.
         * You can obtain data for this particular row from DataHolder
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
        Cells: {
            [key: string]: ICell;
        };
        /**
         * Special rows are bein added automatically.
         * This mark denotes them to avoid confusion
         */
        IsSpecial?: boolean;
        /**
         * Overriden Template ID for row
         */
        TemplateIdOverride?: string;
    }
    interface ITemplatesProvider {
        /** Current handlebars.js engine instance */
        HandlebarsInstance: Handlebars.IHandlebars;
        /**
        * Retrieves cached template handlebars function
        *
        * @param templateId Template id
        * @returns Handlebars function
        */
        getCachedTemplate(templateId: string): (arg: any) => string;
    }
    interface IColumn {
        /** Raw column name */
        RawName: string;
        /** Column configuration */
        Configuration: Configuration.Json.IColumnConfiguration;
        /** Reference to master table */
        MasterTable: IMasterTable;
        /** Column header */
        Header: IColumnHeader;
        /** Column order (left-to-right) */
        Order: number;
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
}
declare module PowerTables {
    /**
     * API responsible for dates operations
     */
    class DateService {
        constructor(datepickerOptions: IDatepickerOptions);
        private _datepickerOptions;
        private ensureDpo();
        /**
         * Determines is passed object valid Date object
         * @param date
         * @returns {}
         */
        isValidDate(date: Date): boolean;
        /**
         * Converts jsDate object to server's understandable format
         *
         * @param date Date object
         * @returns {string} Date in ISO 8601 format
         */
        serialize(date?: Date): any;
        /**
         * Parses ISO date string to regular Date object
         *
         * @param dateString Date string containing date in ISO 8601
         * @returns {}
         */
        parse(dateString: string): Date;
        /**
         * Retrieves Date object from 3rd party datepicker exposed by HTML element
         *
         * @param element HTML element containing datepicker componen
         * @returns {Date} Date object or null
         */
        getDateFromDatePicker(element: HTMLElement): Date;
        /**
         * Creates datepicker object of HTML element using configured function
         *
         * @param element HTML element that should be converted to datepicker
         */
        createDatePicker(element: HTMLElement, isNullableDate?: boolean): void;
        /**
         * Passes Date object to datepicker element
         *
         * @param element HTML element containing datepicker componen
         * @param date Date object to supply to datepicker or null
         */
        putDateToDatePicker(element: HTMLElement, date: Date): void;
    }
}
declare module PowerTables {
    import DOMLocator = PowerTables.Rendering.DOMLocator;
    class EventsDelegator {
        constructor(locator: DOMLocator, bodyElement: HTMLElement, layoutElement: HTMLElement, rootId: string);
        private static addHandler(element, type, handler);
        private static removeHandler(element, type, handler);
        private _rootId;
        private _locator;
        private _bodyElement;
        private _layoutElement;
        private _outSubscriptions;
        private _cellDomSubscriptions;
        private _rowDomSubscriptions;
        private _matches;
        private _domEvents;
        private _outEvents;
        private ensureEventSubscription(eventId);
        private ensureOutSubscription(eventId);
        private traverseAndFire(subscriptions, path, args);
        private onTableEvent(e);
        /**
         * Subscribe handler to any DOM event happening on particular table cell
         *
         * @param subscription Event subscription
         */
        subscribeCellEvent(subscription: IUiSubscription<ICellEventArgs>): void;
        /**
         * Subscribe handler to any DOM event happening on particular table row.
         * Note that handler will fire even if particular table cell event happened
         *
         * @param subscription Event subscription
         */
        subscribeRowEvent(subscription: IUiSubscription<IRowEventArgs>): void;
        private parseEventId(eventId);
        private filterEvent(e, propsObject);
        private _directSubscriptions;
        subscribeEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]): void;
        private onOutTableEvent(e);
        subscribeOutOfElementEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]): void;
        unsubscribeRedundantEvents(e: HTMLElement): void;
        private collectElementsHavingAttribute(parent, attribute);
    }
    interface IRowEventArgs {
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
    interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column index related to particular cell.
         * Column object can be restored using Table.InstanceManager.getUiColumns()[ColumnIndex]
         */
        ColumnIndex: number;
    }
    interface ISubscription {
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
        filter?: {
            [key: string]: any;
        };
    }
    /**
     * Information about UI subscription
     */
    interface IUiSubscription<TEventArgs> extends ISubscription {
        /**
         * Event handler
         *
         * @param e Event arguments
         */
        Handler: (e: TEventArgs) => any;
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
         * "Before Layout Drawn" event.
         * Occurs before layout is actually drawn but after all table is initialized.
         */
        BeforeLayoutRendered: TableEvent<any>;
        /**
                 * "Before Filter Gathering" event.
                 * Occurs every time before sending request to server via Loader before
                 * filtering information is being gathered. Here you can add your own
                 * additional data to prepared query that will be probably overridden by
                 * other query providers.
                 */
        BeforeQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        BeforeClientQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        /**
         * "After Filter Gathering" event.
         * Occurs every time before sending request to server via Loader AFTER
         * filtering information is being gathered. Here you can add your own
         * additional data to prepared query that will probably override parameters
         * set by another query providers.
         */
        AfterQueryGathering: TableEvent<IQueryGatheringEventArgs>;
        AfterClientQueryGathering: TableEvent<IQueryGatheringEventArgs>;
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
        BeforeClientDataProcessing: TableEvent<IQuery>;
        AfterClientDataProcessing: TableEvent<IClientDataResults>;
        AfterLayoutRendered: TableEvent<any>;
        AfterDataRendered: TableEvent<any>;
        BeforeDataRendered: TableEvent<any>;
        /**
         * "After Loading" event.
         * Occurs every time after EVERY operation connected to server response handling
         * has been finished
         */
        AfterLoading: TableEvent<ILoadingEventArgs>;
        /**
         * "Before Client Rows Rendering" event.
         *
         * Occurs every time after after rows set for client-side was
         * modified but not rendered yet. Here you can add/remove/modify render for
         * particular rows
         */
        BeforeClientRowsRendering: TableEvent<IRow[]>;
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
        SelectionChanged: TableEvent<string[]>;
    }
    /**
     * Interface for client data results event args
     */
    interface IClientDataResults {
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
    interface ITableEventArgs<T> {
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
    interface ILoadingResponseEventArgs extends ILoadingEventArgs {
        /**
         * Response received from server
         */
        Response: IPowerTablesResponse;
    }
    /**
     * Event args for loading error event
     */
    interface ILoadingErrorEventArgs extends ILoadingEventArgs {
        /**
         * Error text
         */
        Reason: string;
        /**
         * Stack trace (if any)
         */
        StackTrace: string;
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
         * Query response
         */
        Data: IPowerTablesResponse;
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
    /**
     * This entity is responsible for integration of data between storage and rendere.
     * Also it provides functionality for table events subscription and
     * elements location
     */
    class Controller {
        constructor(masterTable: IMasterTable);
        private onLoadingError(e);
        private _masterTable;
        /**
         * Initializes full reloading cycle
         * @returns {}
         */
        reload(forceServer?: boolean): void;
        /**
         * Redraws row containing currently visible data object
         *
         * @param dataObject Data object
         * @param idx
         * @returns {}
         */
        redrawVisibleDataObject(dataObject: any, idx?: number): HTMLElement;
        /**
         * Redraws locally visible data
         */
        redrawVisibleData(): void;
        drawAdjustmentResult(adjustmentResult: IAdjustmentResult): void;
        /**
         * Shows full-width table message
         * @param tableMessage Message of type ITableMessage
         * @returns {}
         */
        showTableMessage(tableMessage: ITableMessage): void;
        /**
         * Inserts data entry to local storage
         *
         * @param insertion Insertion command
         */
        insertLocalRow(insertion: IInsertRequest): void;
        /**
         * Removes data entry from local storage
         *
         * @param insertion Insertion command
         */
        deleteLocalRow(deletion: IDeleteRequest): void;
        /**
         * Updates data entry in local storage
         *
         * @param insertion Insertion command
         */
        updateLocalRow(update: IUpdateRequest): void;
        private localFullRefresh();
        private localVisibleReorder();
        /**
         * Converts data object,row and column to cell
         *
         * @param dataObject Data object
         * @param idx Object's displaying index
         * @param column Column that this cell belongs to
         * @param row Row that this cell belongs to
         * @returns {ICell} Cell representing data
         */
        produceCell(dataObject: any, column: IColumn, row: IRow): ICell;
        /**
         * Converts data object to display row
         *
         * @param dataObject Data object
         * @param idx Object's displaying index
         * @param columns Optional displaying columns set
         * @returns {IRow} Row representing displayed object
         */
        produceRow(dataObject: any, idx: number, columns?: IColumn[]): IRow;
        private produceRows();
    }
    /**
     * Behavior of redrawing table after modification
     */
    enum RedrawBehavior {
        /**
         * To perform UI redraw, data will be entirely reloaded from server.
         * Local data will not be affected due to further reloading
         */
        ReloadFromServer = 0,
        /**
         * Filters will be reapplied only locally.
         * Currently displaying data will be entirely redrawn with client filters
         * using locally cached data from server.
         *
         * In this case, if modified rows are not satisfying any server conditions then
         * is will still stay in table. That may seem illogical for target users.
         */
        LocalFullRefresh = 1,
        /**
         * Filters will be reapplied locally but only on currently displaying data.
         *
         * In this case, deleted row will simply disappear, added row will be added to currently
         * displaying cells set and currently displaying set will be re-ordered, modified
         * row will be ordered among only displaying set without filtering.
         * This approach is quite fast and may be useful in various cases
         */
        LocalVisibleReorder = 2,
        /**
         * Simply redraw all the visible cells without additional filtering.
         *
         * May lead to glitches e.g. invalid elements count on page or invalid
         * items order. Most suitable for updating that does not touch filtering/ordering-sensetive
         * data.
         */
        RedrawVisible = 3,
        /**
         * Only particular row mentioned in modification request will be updated.
         * No server reloading, no reordering, no re-sorting. Row will stay in place or
         * will be added at specified position or will be simply disappear from currently displayed set.
         * In some cases such behavior may confuse users, but still stay suitable for most cases.
         * Of course, it will disappear after on next filtering if no more satisfying
         * filter conditions.
         */
        ParticularRowUpdate = 4,
        /**
         * Modification request will not affect UI anyhow until next filtering. Confusing.
         */
        DoNothing = 5,
    }
    /**
     * Base interface for modification commands
     */
    interface IModificationRequest {
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
    interface IInsertRequest extends IModificationRequest {
        /**
         * Object to insert
         */
        DataObject: any;
    }
    /**
     * Data removal request
     */
    interface IDeleteRequest extends IModificationRequest {
    }
    /**
     * Data update request
     */
    interface IUpdateRequest extends IModificationRequest {
        /**
         * Function that will be called on object being updated
         *
         * @param object Data object
         */
        UpdateFn: (object: any) => void;
    }
    interface ITableMessage {
        Message: string;
        AdditionalData: string;
        MessageType: string;
        UiColumnsCount?: number;
        IsMessage?: boolean;
    }
}
declare module PowerTables {
    import AdjustmentData = PowerTables.Editors.IAdjustmentData;
    class DataHolder {
        constructor(masterTable: IMasterTable);
        private _rawColumnNames;
        private _comparators;
        private _filters;
        private _anyClientFiltration;
        private _events;
        private _instances;
        private _masterTable;
        private _needNormalizeDatesForAdjustment;
        /**
         * Data that actually is currently displayed in table
         */
        DisplayedData: any[];
        /**
         * Data that was recently loaded from server
         */
        StoredData: any[];
        /**
         * Enable query truncation from beginning during executing client queries
         */
        EnableClientSkip: boolean;
        /**
         * Enable query truncation by data cound during executing client queries
         */
        EnableClientTake: boolean;
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
        /**
         * Client query that was used to obtain recent local data set
         */
        RecentClientQuery: IQuery;
        /**
         * Filters supplied data set using client query
         *
         * @param objects Data set
         * @param query Client query
         * @returns {Array} Array of filtered items
         */
        filterSet(objects: any[], query: IQuery): any[];
        /**
        * Orders supplied data set using client query
        *
        * @param objects Data set
        * @param query Client query
        * @returns {Array} Array of ordered items
        */
        orderSet(objects: any[], query: IQuery): any[];
        private _previouslyFiltered;
        private _previouslyOrdered;
        /**
         * Filter recent data and store it to currently displaying data
         *
         * @param query Table query
         * @returns {}
         */
        filterStoredData(query: IQuery): void;
        /**
         * Filter recent data and store it to currently displaying data
         * using query that was previously applied to local data
         */
        filterStoredDataWithPreviousQuery(): void;
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
        localLookupDisplayedDataObject(dataObject: any): ILocalLookupResult;
        /**
         * Finds data object among currently displayed and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        localLookupStoredDataObject(dataObject: any): ILocalLookupResult;
        /**
         * Finds data object among currently displayed and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        localLookupDisplayedData(index: number): ILocalLookupResult;
        /**
         * Finds data object among recently loaded and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        localLookupStoredData(index: number): ILocalLookupResult;
        /**
         * Finds data object among recently loaded by primary key and returns ILocalLookupResult
         * containing also Loaded-set index of this data object
         *
         * @param dataObject Object to match
         * @returns ILocalLookupResult
         */
        localLookupPrimaryKey(dataObject: any): ILocalLookupResult;
        copyData(source: any, target: any): string[];
        private normalizeDates(dataObject);
        proceedAdjustments(adjustments: AdjustmentData): IAdjustmentResult;
    }
    interface IAdjustmentResult {
        NeedRedrawAllVisible: boolean;
        VisiblesToRedraw: any[];
        AddedData: any[];
        TouchedData: any[];
        TouchedColumns: string[][];
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
    import TableConfiguration = Configuration.Json.ITableConfiguration;
    /**
     * This thing is used to manage instances of columns, plugins etc.
     * It consumes PT configuration as source and provides caller with
     * plugins instances, variable ways to query them and accessing their properties
     */
    class InstanceManager {
        constructor(configuration: Configuration.Json.ITableConfiguration, masterTable: IMasterTable, events: EventsManager);
        private compileComparisonFunction();
        /**
         * Local objects comparison function based on key fields
         *
         * @param x Local data object 1
         * @param y Local data object 2
         * @returns {Boolean} True if objects are equal with primary key
         */
        DataObjectComparisonFunction: (x: any, y: any) => boolean;
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
        private _isHandlingSpecialPlacementCase;
        private _specialCasePlaceholder;
        private static _datetimeTypes;
        private static _stringTypes;
        private static _floatTypes;
        private static _integerTypes;
        private static _booleanTypes;
        private initColumns();
        initPlugins(): void;
        private startsWith(s1, prefix);
        private endsWith(s1, postfix);
        /**
                 * Reteives plugin at specified placement
                 * @param pluginId Plugin ID
                 * @param placement Pluign placement
                 * @returns {}
                 */
        getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin;
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
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        getColumnNames(): string[];
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        getUiColumnNames(): string[];
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
        private checkError(json, data, req);
        private handleRegularJsonResponse(req, data, clientQuery, callback, errorCallback);
        private handleDeferredResponse(req, data, callback);
        private doServerQuery(data, clientQuery, callback, errorCallback?);
        /**
         * Sends specified request to server and lets table handle it.
         * Always use this method to invoke table's server functionality because this method
         * correctly rises all events, handles errors etc
         *
         * @param command Query command
         * @param callback Callback that will be invoked after data received
         * @param queryModifier Inline query modifier for in-place query modification
         * @param errorCallback Will be called if error occures
         * @returns {}
         */
        requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?: boolean): void;
    }
}
declare module PowerTables.Rendering {
    class BackBinder {
        private _eventsQueue;
        private _markQueue;
        private _datepickersQueue;
        private _callbacksQueue;
        private _instances;
        private _stack;
        private _dateService;
        private _stealer;
        private _cachedVisualStates;
        private _hasVisualStates;
        Delegator: EventsDelegator;
        constructor(hb: Handlebars.IHandlebars, instances: InstanceManager, stack: RenderingStack, dateService: DateService);
        private traverseBackbind<T>(elements, parentElement, backbindCollection, attribute, fn);
        private getMatchingElements(parent, attr);
        /**
         * Applies binding of events left in events queue
         *
         * @param parentElement Parent element to lookup for event binding attributes
         * @returns {}
         */
        backBind(parentElement: HTMLElement): void;
        private resolveNormalStates(targets);
        private addNormalState(states, target);
        private mixinToNormal(normal, custom);
        private bindEventHelper();
        private renderCallbackHelper();
        private markHelper(fieldName, key);
        private datepickerHelper(columnName);
        private visualStateHelper(stateName, stateJson);
    }
    interface IState {
        Element: HTMLElement;
        Receiver: any;
        id: string;
        classes: string[];
        attrs: {
            [key: string]: string;
        };
        styles: {
            [key: string]: string;
        };
        content: string;
    }
    /**
    * Event that was bound from template
    */
    interface ITemplateBoundEvent {
        /**
         * Element triggered particular event
         */
        Element: HTMLElement;
        /**
         * Original DOM event
         */
        EventObject: Event;
        /**
         * Event received (to avoid using "this" in come cases)
         */
        Receiver: any;
        /**
         * Event argumetns
         */
        EventArguments: any[];
    }
}
declare module PowerTables.Rendering {
    /**
     * Part of renderer that is responsible for rendering of dynamically loaded content
     */
    class ContentRenderer {
        constructor(templatesProvider: ITemplatesProvider, stack: Rendering.RenderingStack, instances: InstanceManager, coreTemplates: ICoreTemplateIds);
        private _hb;
        private _templatesProvider;
        private _columnsRenderFunctions;
        private _stack;
        private _instances;
        private _templateIds;
        /**
         * Renders supplied table rows to string
         *
         * @param rows Table rows
         * @returns String containing HTML of table rows
         */
        renderBody(rows: IRow[]): string;
        renderCell(cell: ICell): string;
        renderContent(columnName?: string): string;
        private cacheColumnRenderers(columns);
        /**
         * Adds/replaces column rendering function for specified column
         *
         * @param column Column to cache renderer for
         * @param fn Rendering function
         */
        cacheColumnRenderingFunction(column: IColumn, fn: (x: ICell) => string): void;
    }
}
declare module PowerTables.Rendering {
    class DOMModifier {
        constructor(stack: RenderingStack, locator: DOMLocator, backBinder: BackBinder, templatesProvider: ITemplatesProvider, layoutRenderer: LayoutRenderer, instances: InstanceManager, ed: EventsDelegator);
        private _ed;
        private _stack;
        private _locator;
        private _backBinder;
        private _templatesProvider;
        private _layoutRenderer;
        private _instances;
        private getRealDisplay(elem);
        private displayCache;
        private hideElement(el);
        private showElement(el);
        private destroyElement(element);
        private destroyElements(elements);
        private hideElements(element);
        private showElements(element);
        /**
         * Redraws specified plugin refreshing all its graphical state
         *
         * @param plugin Plugin to redraw
         * @returns {}
         */
        redrawPlugin(plugin: IPlugin): HTMLElement;
        renderPlugin(plugin: IPlugin): HTMLElement;
        /**
         * Redraws specified plugins refreshing all them graphical state (by position)
         *
         * @param position Plugin position
         * @returns {}
         */
        redrawPluginsByPosition(position: string): void;
        hidePlugin(plugin: IPlugin): void;
        showPlugin(plugin: IPlugin): void;
        destroyPlugin(plugin: IPlugin): void;
        hidePluginsByPosition(position: string): void;
        showPluginsByPosition(position: string): void;
        destroyPluginsByPosition(position: string): void;
        /**
         * Redraws specified row refreshing all its graphical state
         *
         * @param row
         * @returns {}
         */
        redrawRow(row: IRow): HTMLElement;
        destroyRow(row: IRow): void;
        hideRow(row: IRow): void;
        showRow(row: IRow): void;
        /**
         * Redraws specified row refreshing all its graphical state
         *
         * @param row
         * @returns {}
         */
        appendRow(row: IRow, afterRowAtIndex: number): HTMLElement;
        /**
         * Removes referenced row by its index
         *
         * @param rowDisplayIndex
         * @returns {}
         */
        destroyRowByIndex(rowDisplayIndex: number): void;
        hideRowByIndex(rowDisplayIndex: number): void;
        showRowByIndex(rowDisplayIndex: number): void;
        redrawCell(cell: ICell): HTMLElement;
        destroyCell(cell: ICell): void;
        hideCell(cell: ICell): void;
        showCell(cell: ICell): void;
        destroyCellsByColumn(column: IColumn): void;
        hideCellsByColumn(column: IColumn): void;
        showCellsByColumn(column: IColumn): void;
        destroyColumnCellsElementsByColumnIndex(columnIndex: number): void;
        hideColumnCellsElementsByColumnIndex(columnIndex: number): void;
        showColumnCellsElementsByColumnIndex(columnIndex: number): void;
        /**
         * Redraws header for specified column
         *
         * @param column Column which header is to be redrawn
         */
        redrawHeader(column: IColumn): HTMLElement;
        destroyHeader(column: IColumn): void;
        hideHeader(column: IColumn): void;
        showHeader(column: IColumn): void;
        createElement(html: string): HTMLElement;
        private replaceElement(element, html);
    }
}
declare module PowerTables.Rendering.Html2Dom {
    class HtmlParserDefinitions {
        static startTag: RegExp;
        static endTag: RegExp;
        static attr: RegExp;
        static empty: {
            [index: string]: boolean;
        };
        static block: {
            [index: string]: boolean;
        };
        static inline: {
            [index: string]: boolean;
        };
        static closeSelf: {
            [index: string]: boolean;
        };
        static fillAttrs: {
            [index: string]: boolean;
        };
        static special: {
            [index: string]: boolean;
        };
        private static makeMap(str);
    }
    /**
     * Small HTML parser to turn user's HTMl to DOM
     * Thanks to John Resig, co-author of jQuery
     * http://ejohn.org/blog/pure-javascript-html-parser/
     */
    class HtmlParser {
        constructor();
        private _stack;
        private parse(html);
        private parseStartTag(tag, tagName, rest, unary);
        private parseEndTag(tag?, tagName?);
        private _curParentNode;
        private _elems;
        private _topNodes;
        private start(tagName, attrs, unary);
        private end(tag);
        private chars(text);
        html2Dom(html: string): HTMLElement;
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
        private _stack;
        private _templateIds;
        constructor(templates: ITemplatesProvider, stack: RenderingStack, instances: InstanceManager, coreTemplates: ICoreTemplateIds);
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
        /**
         * Renders specified column's header into string including its wrapper
         *
         * @param column Column which header is about to be rendered
         * @returns {}
         */
        renderHeader(column: IColumn): string;
        private headersHelper();
        renderContent(columnName?: string): string;
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
         * Retrieves cell element by cell object
         *
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        getCellElement(cell: ICell): HTMLElement;
        /**
         * Retrieves cell element using supplied coordinates
         *
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        getCellElementByIndex(rowDisplayIndex: number, columnIndex: number): HTMLElement;
        /**
         * Retrieves row element (including wrapper)
         *
         * @param row Row
         * @returns HTML element
         */
        getRowElement(row: IRow): HTMLElement;
        /**
        * Retrieves row element (including wrapper) by specified row index
        *
        * @param row Row
        * @returns HTML element
        */
        getRowElementByIndex(rowDisplayingIndex: number): HTMLElement;
        /**
         * Retrieves data cells for specified column (including wrappers)
         *
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        getColumnCellsElements(column: IColumn): NodeList;
        /**
         * Retrieves data cells for specified column (including wrappers) by column index
         *
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        getColumnCellsElementsByColumnIndex(columnIndex: number): NodeList;
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
        /**
         * Retrieves HTML element for plugin (including wrapper)
         *
         * @param plugin Plugin
         * @returns HTML element
         */
        getPluginElementsByPositionPart(placement: string): NodeList;
        /**
         * Determines if supplied element is table row
         *
         * @param e Testing element
         * @returns {boolean} True when supplied element is row, false otherwise
         */
        isRow(e: HTMLElement): boolean;
        /**
         * Determines if supplied element is table cell
         *
         * @param e Testing element
         * @returns {boolean} True when supplied element is cell, false otherwise
         */
        isCell(e: HTMLElement): boolean;
    }
}
declare module PowerTables.Rendering {
    /**
     * Enity responsible for displaying table
     */
    class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, instances: InstanceManager, events: EventsManager, dateService: DateService, coreTemplates: ICoreTemplateIds);
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
        /**
         * BackBinder instance
         */
        BackBinder: BackBinder;
        /**
         * Renderer that is responsible for layout rendering
         */
        LayoutRenderer: LayoutRenderer;
        /**
         * Entity that is responsible for content rendering
         */
        ContentRenderer: ContentRenderer;
        /**
         * Entity that is responsible for existing DOM modifications
         */
        Modifier: DOMModifier;
        /**
         * API that is responsible for UI events delegation
         */
        Delegator: EventsDelegator;
        private _instances;
        private _stack;
        private _datepickerFunction;
        private _templatesCache;
        private _rootId;
        private _events;
        private _templateIds;
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
         * Removes all dynamically loaded content in table
         *
         * @returns {}
         */
        clearBody(): void;
        contentHelper(columnName?: string): string;
        private trackHelper();
        private ifqHelper(a, b, opts);
        private iflocHelper(location, opts);
    }
}
declare module PowerTables.Rendering {
    /**
     * Component for managing components visual states
     */
    class VisualState {
        States: {
            [key: string]: IState[];
        };
        /**
         * Current visual state
         */
        Current: string;
        private _subscribers;
        private _stopEvents;
        /**
         * Subscribes specified function to state change events
         *
         * @param fn Function that will be called when state changes
         */
        subscribeStateChange(fn: (evt: IStateChangedEvent) => void): void;
        private fireHandlers(e);
        /**
         * Applies settings for specified state
         *
         * @param state State id
         * @param states VisualStates collection
         */
        changeState(state: string): void;
        /**
         * Mixins settings for specified state
         *
         * @param state State id
         * @param states VisualStates collection
         */
        mixinState(state: string): void;
        /**
         * Unmixins state of current state
         *
         * @param state State to unmixin
         * @returns {}
         */
        unmixinState(state: string): void;
        /**
         * Reverts elements back to normal state
         *
         * @param states VisualStates collection
         */
        normalState(): void;
        private applyState(desired);
        private getContent(receiver, contentLocation);
        private setNormal();
    }
    interface IStateChangedEvent {
        State: string;
        CurrentState: string;
        StateWasMixedIn: boolean;
    }
}
declare module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration;
    import AdjustmentData = PowerTables.Editors.IAdjustmentData;
    class PowerTable implements IMasterTable {
        constructor(configuration: TableConfiguration);
        private _isReady;
        private bindReady();
        private _configuration;
        private initialize();
        /**
         * API for working with dates
         */
        Date: DateService;
        /**
         * Reloads table content.
         * This method is left for backward compatibility
         *
         * @returns {}
         */
        reload(): void;
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
        /**
         * Fires specified DOM event on specified element
         *
         * @param eventName DOM event id
         * @param element Element is about to dispatch event
         */
        static fireDomEvent(eventName: string, element: HTMLElement): void;
        proceedAdjustments(adjustments: AdjustmentData): void;
    }
}
declare module PowerTables.Plugins {
    class PluginBase<TConfiguration> implements IPlugin {
        init(masterTable: IMasterTable): void;
        /**
         * Raw plugin configuration
         */
        RawConfig: Configuration.Json.IPluginConfiguration;
        /**
         * Plugin location ID
         */
        PluginLocation: string;
        /**
         * Plugin's visual states collection.
         * Usually it is not used, but always it is better to have one
         */
        VisualStates: PowerTables.Rendering.VisualState;
        /**
         * Plugin configuration object
         */
        protected Configuration: TConfiguration;
        /**
         * Reference to master table this plugin belongs to
         */
        MasterTable: IMasterTable;
        /**
         * Events subscription method.
         * In derived class here should be subscription to various events
         *
         * @param e Events manager
         */
        protected subscribe(e: EventsManager): void;
        /**
         * In this method you can register any additional Handlebars.js helpers in case of your
         * templates needs ones
         *
         * @param hb Handlebars instance
         * @returns {}
         */
        protected registerAdditionalHelpers(hb: Handlebars.IHandlebars): void;
        /**
         * Function that is called after plugin is drawn
         *
         * @param e Event arguments
         */
        protected afterDrawn: (e: ITableEventArgs<any>) => void;
        /**
         * Plugin order among particular placement
         */
        Order: number;
        /**
         * Default render function using TemplateId from plugin configuration
         * @param e Templates provider
         * @returns content string
         */
        defaultRender(e: ITemplatesProvider): string;
    }
}
declare module PowerTables.Plugins {
    /**
     * Base class for creating filters
     */
    class FilterBase<T> extends PluginBase<T> implements IQueryPartProvider, IClientFilter {
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        /**
         * Call this method inside init and override filterPredicate method to make this filter
         * participate in client-side filtering
         */
        protected itIsClientFilter(): void;
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }
}
declare module PowerTables.Plugins {
    class LoadingPlugin extends PluginBase<any> implements ILoadingPlugin {
        BlinkElement: HTMLElement;
        subscribe(e: EventsManager): void;
        showLoadingIndicator(): void;
        hideLoadingIndicator(): void;
        static Id: string;
        renderContent(templatesProvider: ITemplatesProvider): string;
    }
    /**
     * Loading indicator plugin.
     * Plugin Id: Loading
     */
    interface ILoadingPlugin {
        /**
         * Shows loading indicator
         */
        showLoadingIndicator(): void;
        /**
         * Hides loading indicator
         */
        hideLoadingIndicator(): void;
    }
}
declare module PowerTables.Plugins.Ordering {
    class OrderingPlugin extends FilterBase<IOrderingConfiguration> {
        private _clientOrderings;
        private _serverOrderings;
        private _boundHandler;
        subscribe(e: EventsManager): void;
        private overrideHeadersTemplates(columns);
        private updateOrdering(columnName, ordering);
        private specifyOrdering(object, ordering);
        private isClient(columnName);
        switchOrderingForColumn(columnName: string): void;
        setOrderingForColumn(columnName: string, ordering: PowerTables.Ordering): void;
        protected nextOrdering(currentOrdering: PowerTables.Ordering): Ordering;
        private makeDefaultOrderingFunction(fieldName);
        init(masterTable: IMasterTable): void;
        private mixinOrderings(orderingsCollection, query);
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }
}
declare module PowerTables.Plugins {
    import LimitClientConfiguration = Plugins.Limit.ILimitClientConfiguration;
    import TemplateBoundEvent = Rendering.ITemplateBoundEvent;
    class LimitPlugin extends FilterBase<LimitClientConfiguration> implements ILimitPlugin {
        SelectedValue: ILimitSize;
        private _limitSize;
        Sizes: ILimitSize[];
        renderContent(templatesProvider: ITemplatesProvider): string;
        changeLimitHandler(e: TemplateBoundEvent): void;
        changeLimit(limit: number): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        private onColumnsCreation();
    }
    /**
     * Size entry for limit plugin
     */
    interface ILimitSize {
        IsSeparator: boolean;
        Value: number;
        Label: string;
    }
}
declare module PowerTables.Plugins {
    import TemplateBoundEvent = Rendering.ITemplateBoundEvent;
    import PagingClientConfiguration = Plugins.Paging.IPagingClientConfiguration;
    class PagingPlugin extends FilterBase<PagingClientConfiguration> implements IPagingPlugin {
        Pages: IPagesElement[];
        Shown: boolean;
        NextArrow: boolean;
        PrevArrow: boolean;
        private _selectedPage;
        CurrentPage(): number;
        TotalPages(): number;
        PageSize(): number;
        private _totalPages;
        private _pageSize;
        GotoInput: HTMLInputElement;
        getCurrentPage(): number;
        getTotalPages(): number;
        getPageSize(): number;
        private onFilterGathered(e);
        private onColumnsCreation();
        private onResponse(e);
        private onClientDataProcessing(e);
        goToPage(page: string): void;
        gotoPageClick(e: TemplateBoundEvent): void;
        navigateToPage(e: TemplateBoundEvent): void;
        nextClick(e: TemplateBoundEvent): void;
        previousClick(e: TemplateBoundEvent): void;
        private constructPagesElements();
        renderContent(templatesProvider: ITemplatesProvider): string;
        validateGotopage(): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
    }
    interface IPagesElement {
        Prev?: boolean;
        Period?: boolean;
        ActivePage?: boolean;
        Page: number;
        First?: boolean;
        Last?: boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }
}
declare module PowerTables.Plugins {
    import ValueFilterUiConfig = Filters.Value.IValueFilterUiConfig;
    class ValueFilterPlugin extends FilterBase<ValueFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _previousValue;
        private _associatedColumn;
        private _isInitializing;
        FilterValueProvider: HTMLInputElement;
        private getValue();
        handleValueChanged(): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        init(masterTable: IMasterTable): void;
        filterPredicate(rowObject: any, query: IQuery): boolean;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        afterDrawn: (e: any) => void;
    }
}
declare module PowerTables.Plugins {
    import RangeFilterUiConfig = Filters.Range.IRangeFilterUiConfig;
    class RangeFilterPlugin extends FilterBase<RangeFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _fromPreviousValue;
        private _toPreviousValue;
        private _associatedColumn;
        private _isInitializing;
        FromValueProvider: HTMLInputElement;
        ToValueProvider: HTMLInputElement;
        private getFromValue();
        private getToValue();
        handleValueChanged(): void;
        getFilterArgument(): string;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        filterPredicate(rowObject: any, query: IQuery): boolean;
        afterDrawn: (e: any) => void;
    }
}
declare module PowerTables.Plugins {
    import SelectFilterUiConfig = Filters.Select.ISelectFilterUiConfig;
    class SelectFilterPlugin extends FilterBase<SelectFilterUiConfig> {
        FilterValueProvider: HTMLSelectElement;
        private _associatedColumn;
        getArgument(): string;
        getSelectionArray(): string[];
        modifyQuery(query: IQuery, scope: QueryScope): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        handleValueChanged(): void;
        init(masterTable: IMasterTable): void;
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }
}
declare module PowerTables.Plugins {
    import HideoutClientConfiguration = PowerTables.Plugins.Hideout.IHideoutPluginConfiguration;
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
        DoesNotExists: boolean;
    }
    class HideoutPlugin extends PluginBase<HideoutClientConfiguration> implements IQueryPartProvider, IHideoutPlugin {
        ColumnStates: IColumnState[];
        private _columnStates;
        private _isInitializing;
        isColumnVisible(columnName: string): boolean;
        isColumnInstanceVisible(col: IColumn): boolean;
        hideColumnByName(rawColname: string): void;
        showColumnByName(rawColname: string): void;
        toggleColumn(e: TemplateBoundEvent): void;
        showColumn(e: TemplateBoundEvent): void;
        hideColumn(e: TemplateBoundEvent): void;
        toggleColumnByName(columnName: string): boolean;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        hideColumnInstance(c: IColumn): void;
        showColumnInstance(c: IColumn): void;
        private onBeforeDataRendered();
        private onDataRendered();
        private onLayourRendered();
        init(masterTable: IMasterTable): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        subscribe(e: EventsManager): void;
    }
}
declare module PowerTables.Plugins {
    import ResponseInfoClientConfiguration = Plugins.ResponseInfo.IResponseInfoClientConfiguration;
    class ResponseInfoPlugin extends PluginBase<ResponseInfoClientConfiguration> {
        private _recentData;
        private _recentServerData;
        private _recentTemplate;
        private _pagingEnabled;
        private _pagingPlugin;
        private _isServerRequest;
        private _isReadyForRendering;
        onResponse(e: ITableEventArgs<IDataEventArgs>): void;
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        init(masterTable: IMasterTable): void;
    }
}
declare module PowerTables.Plugins {
    import TotalClientConfiguration = Plugins.Total.ITotalClientConfiguration;
    class TotalsPlugin extends PluginBase<TotalClientConfiguration> {
        private _totalsForColumns;
        private makeTotalsRow();
        onResponse(e: ITableEventArgs<IDataEventArgs>): void;
        onClientRowsRendering(e: ITableEventArgs<IRow[]>): void;
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        subscribe(e: EventsManager): void;
    }
}
declare module PowerTables.Plugins {
    import CheckboxifyClientConfig = Plugins.Checkboxify.ICheckboxifyClientConfig;
    class CheckboxifyPlugin extends PluginBase<CheckboxifyClientConfig> implements IQueryPartProvider {
        private _selectedItems;
        private _visibleAll;
        private _allSelected;
        private _ourColumn;
        private _valueColumnName;
        private _canSelectAll;
        selectAll(selected?: boolean): void;
        private redrawHeader();
        private createColumn();
        private canCheck(dataObject, row);
        getSelection(): string[];
        selectByRowIndex(rowIndex: number): void;
        private afterLayoutRender();
        private beforeRowsRendering(e);
        private enableSelectAll(enabled);
        private onClientReload(e);
        private onServerReload(e);
        init(masterTable: IMasterTable): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        static registerEvents(e: EventsManager, masterTable: IMasterTable): void;
        subscribe(e: EventsManager): void;
    }
}
declare module PowerTables.Plugins {
    import ToolbarButtonsClientConfiguration = Plugins.Toolbar.IToolbarButtonsClientConfiguration;
    import TemplateBoundEvent = Rendering.ITemplateBoundEvent;
    class ToolbarPlugin extends PluginBase<ToolbarButtonsClientConfiguration> {
        AllButtons: {
            [id: number]: HTMLElement;
        };
        private _buttonsConfig;
        buttonHandleEvent(e: TemplateBoundEvent): void;
        private redrawMe();
        private handleButtonAction(btn);
        renderContent(templatesProvider: ITemplatesProvider): string;
        private traverseButtons(arr);
        private onSelectionChanged(e);
        init(masterTable: IMasterTable): void;
    }
}
declare module PowerTables.Plugins {
    import FormwatchClientConfiguration = PowerTables.Plugins.Formwatch.IFormwatchClientConfiguration;
    class FormwatchPlugin extends PluginBase<FormwatchClientConfiguration> implements IQueryPartProvider {
        private _existingValues;
        private _filteringExecuted;
        private _timeouts;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        subscribe(e: EventsManager): void;
        fieldChange(fieldSelector: string, delay: number, element: HTMLInputElement, e: Event): void;
        init(masterTable: IMasterTable): void;
    }
}
declare module PowerTables.Plugins {
    import CellEditorBase = PowerTables.Plugins.Editors.ICellEditor;
    import EditorUiConfig = PowerTables.Editors.IEditorUiConfig;
    class Editor extends PluginBase<EditorUiConfig> implements IRow {
        Cells: {
            [key: string]: ICell;
        };
        DataObject: any;
        IsSpecial: boolean;
        Index: number;
        private _mode;
        private _activeEditors;
        private _currentDataObjectModified;
        private _isEditing;
        private _validationMessages;
        notifyChanged(editor: CellEditorBase): void;
        commitAll(): void;
        private dispatchEditResponse(editResponse, then);
        private sendDataObjectToServer(then);
        commit(editor: CellEditorBase): void;
        redrawEditingRow(collectData: boolean): void;
        redrawMe(editor: CellEditorBase): void;
        private cleanupAfterEdit();
        rejectAll(): void;
        private finishEditing(editor, redraw);
        reject(editor: CellEditorBase): void;
        private retrieveEditorData(editor, errors?);
        private retrieveAllEditorsData();
        private ensureEditing(rowDisplayIndex);
        private isEditable(column);
        private createEditor(column, canComplete, isForm, isRow);
        private beginCellEdit(column, canComplete, isForm, isRow, rowIndex);
        private setEditorValue(editor);
        onBeforeClientRowsRendering(e: ITableEventArgs<IRow[]>): void;
        onAfterDataRendered(e: any): void;
        beginCellEditHandle(e: ICellEventArgs): void;
        beginRowEditHandle(e: IRowEventArgs): void;
        beginFormEditHandle(e: IRowEventArgs): void;
        commitRowEditHandle(e: IRowEventArgs): void;
        commitFormEditHandle(e: IRowEventArgs): void;
        rejectRowEditHandle(e: IRowEventArgs): void;
        rejectFormEditHandle(e: IRowEventArgs): void;
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
    interface IValidationMessage {
        Message: string;
        Code: string;
    }
}
declare module PowerTables.Plugins.Editors {
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    class CellEditorBase<T> extends PluginBase<T> implements ICellEditor {
        /**
         * Is current editor valid (flag set by master editor)
         */
        IsValid: boolean;
        /**
         * True when field is single, false when multiple (e.g. row edit, form edit)
         */
        CanComplete: boolean;
        /**
         * True when cell editor is part of row edit, otherwise false
         */
        IsRowEdit: boolean;
        /**
         * True when cell editor is part of form edit, otherwise false
         */
        IsFormEdit: boolean;
        /**
         * Original, locally displayed data object
         */
        DataObject: any;
        /**
         * Value for particular editor column
         */
        Data: any;
        /**
         * Collection with editor's recent validation messages
         */
        ValidationMessages: IValidationMessage[];
        renderedValidationMessages(): string;
        /**
         * Retrieves original value for this particular cell editor
         *
         * @returns {Any} Original, unchanged value
         */
        protected getThisOriginalValue(): any;
        /**
         * Resets editor value to initial settings
         */
        reset(): void;
        /**
         * Data object that is modified within editing process
         */
        ModifiedDataObject: any;
        /**
         * Reference to parent editor
         */
        Row: Editor;
        /**
         * Corresponding column
         */
        Column: IColumn;
        /**
         * Flag when initial value setting occures
         */
        IsInitialValueSetting: boolean;
        /**
         * Returns entered editor value
         *
         * @returns {}
         */
        getValue(errors: IValidationMessage[]): any;
        /**
         * Sets editor value from the outside
         */
        setValue(value: any): void;
        /**
         * Template-bound event raising on changing this editor's value
         */
        changedHandler(e: TemplateBoundEvent): void;
        /**
         * Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditor
         * Commit leads to validation. Cell editor should be notified
         */
        commitHandler(e: TemplateBoundEvent): void;
        /**
         * Event handler for reject (cancel editing) event raised from inside of CellEditor
         * Cell editor should be notified
         */
        rejectHandler(e: TemplateBoundEvent): void;
        /**
         * Called when cell editor has been drawn
         *
         * @param e HTML element where editor is rendered
         * @returns {}
         */
        onAfterRender(e: HTMLElement): void;
        /**
         * Needed by editor in some cases
         *
         * @returns {}
         */
        focus(): void;
        OriginalContent(): string;
    }
    interface ICellEditor extends IPlugin, ICell {
        /**
         * Plugin's visual states collection.
         * Usually it is not used, but always it is better to have one
         */
        VisualStates: PowerTables.Rendering.VisualState;
        /**
         * Original, locally displayed data object
         */
        DataObject: any;
        /**
         * Data object that is modified within editing process
         */
        ModifiedDataObject: any;
        /**
         * Returns entered editor value
         *
         * @param errors Validation errors collection
         * @returns {}
         */
        getValue(errors: IValidationMessage[]): any;
        /**
         * Sets editor value from the outside
         */
        setValue(value: any): void;
        /**
         * Corresponding column
         */
        Column: IColumn;
        /**
         * Resets editor value to initial settings
         */
        reset(): void;
        /**
         * True when field is single, false when multiple (e.g. row edit, form edit)
         */
        CanComplete: boolean;
        /**
         * True when cell editor is part of row edit, otherwise false
         */
        IsRowEdit: boolean;
        /**
         * True when cell editor is part of form edit, otherwise false
         */
        IsFormEdit: boolean;
        /**
         * Flag when initial value setting occures
         */
        IsInitialValueSetting: boolean;
        /**
        * Called when cell editor has been drawn
        *
        * @param e HTML element where editor is rendered
        * @returns {}
        */
        onAfterRender(e: HTMLElement): void;
        /**
         * Is current editor valid (flag set by master editor)
         */
        IsValid: boolean;
        /**
         * Needed by editor in some cases
         *
         * @returns {}
         */
        focus(): void;
        /**
         * Collection with editor's recent validation messages
         */
        ValidationMessages: IValidationMessage[];
    }
}
declare module PowerTables.Plugins.Editors {
    import PlainTextEditorUiConfig = PowerTables.Editors.PlainText.IPlainTextEditorUiConfig;
    class PlainTextEditor extends CellEditorBase<PlainTextEditorUiConfig> {
        Input: HTMLInputElement;
        ValidationRegex: RegExp;
        private _removeSeparators;
        private _dotSeparators;
        private _floatRegex;
        private _formatFunction;
        private _parseFunction;
        getValue(errors: IValidationMessage[]): any;
        setValue(value: any): void;
        init(masterTable: IMasterTable): void;
        private defaultParse(value, column, errors);
        private defaultFormat(value, column);
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        focus(): void;
    }
}
declare module PowerTables.Plugins.Editors {
    import SelectListEditorUiConfig = PowerTables.Editors.SelectList.ISelectListEditorUiConfig;
    import SelectListItem = System.Web.Mvc.ISelectListItem;
    import StateChangedEvent = PowerTables.Rendering.IStateChangedEvent;
    class SelectListEditor extends CellEditorBase<SelectListEditorUiConfig> {
        List: HTMLSelectElement;
        Items: SelectListItem[];
        SelectedItem: SelectListItem;
        getValue(errors: IValidationMessage[]): any;
        setValue(value: any): void;
        onStateChange(e: StateChangedEvent): void;
        init(masterTable: IMasterTable): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        onAfterRender(e: HTMLElement): void;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        focus(): void;
    }
}
declare module PowerTables.Plugins {
    import LoadingOverlapUiConfig = PowerTables.Plugins.LoadingOverlap.ILoadingOverlapUiConfig;
    class LoadingOverlapPlugin extends PluginBase<LoadingOverlapUiConfig> {
        private _overlappingElement;
        private _overlapLayer;
        private overlap();
        private updateCoords();
        private deoverlap();
        private onBeforeLoading(e);
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
declare module PowerTables.Plugins.Editors {
    import CheckEditorUiConfig = PowerTables.Editors.Check.ICheckEditorUiConfig;
    class CheckEditor extends CellEditorBase<CheckEditorUiConfig> {
        FocusElement: HTMLElement;
        private _value;
        renderContent(templatesProvider: ITemplatesProvider): string;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        private updateState();
        getValue(errors: PowerTables.Plugins.IValidationMessage[]): any;
        setValue(value: any): void;
        focus(): void;
    }
}
declare module PowerTables.Plugins.Editors {
    import MemoEditorUiConfig = PowerTables.Editors.Memo.IMemoEditorUiConfig;
    class MemoEditor extends CellEditorBase<MemoEditorUiConfig> {
        TextArea: HTMLInputElement;
        MaxChars: number;
        CurrentChars: number;
        Rows: number;
        WarningChars: number;
        Columns: number;
        init(masterTable: IMasterTable): void;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        setValue(value: any): void;
        getValue(errors: PowerTables.Plugins.IValidationMessage[]): any;
        renderContent(templatesProvider: ITemplatesProvider): string;
        focus(): void;
    }
}
