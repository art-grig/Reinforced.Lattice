/// <reference path="../../PowerTables.Script/Scripts/PowerTables/ExternalTypings.d.ts" />
declare module PowerTables.Configuration.Json {
    /** Configuration JSON object for whole table */
    interface ITableConfiguration {
        /**
        * Appends empty filter if there are no filters for any columns.
        *             This option fits good in case of table form-factor
        */
        EmptyFiltersPlaceholder: string;
        /** Templates prefix. It is used to distinguish several templates sets on single page from each other */
        Prefix: string;
        /** Root ID */
        TableRootId: string;
        /** URL for table requests (relative to website root) */
        OperationalAjaxUrl: string;
        /** When true, table data will be loaded immediately after initialization */
        LoadImmediately: boolean;
        /** Mandatory object to interact with datepicker */
        DatepickerOptions: PowerTables.IDatepickerOptions;
        /** Table columns */
        Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
        /** Custom plugins configuration. Key: pluginId, Value: configuration */
        PluginsConfiguration: PowerTables.Configuration.Json.IPluginConfiguration[];
        /** Static data that will be embedded into table and sent within each request */
        StaticData: string;
        /** Core template IDs */
        CoreTemplates: PowerTables.ICoreTemplateIds;
        /** Object's key fields. Necessary for some operations */
        KeyFields: string[];
        /** Template ID for adjusted cells */
        TouchedCellTemplateId: string;
        /** Template ID for adjusted rows */
        TouchedRowTemplateId: string;
        /** Template ID for adjusted rows */
        AddedRowTemplateId: string;
        /** Function that will be called after tables initialization */
        CallbackFunction: (table: IMasterTable) => void;
        /**
        * Function that should consume IRow instance and return template name for this particular row.
        *             Return null/empty/undefined will let system to choose default template
        */
        TemplateSelector: (row: IRow) => string;
        /**
        * Function that shows user messages.
        *             Function type is (msg: ITableMessage) =&gt; void
        */
        MessageFunction: (msg: ITableMessage) => void;
        /** Cell/row event subscriptions */
        Subscriptions: PowerTables.Configuration.Json.IConfiguredSubscriptionInfo[];
        /**
        * Function that will be invoked before performing query
        *             Function type is (query:IPowerTableRequest,scope:QueryScope,continueFn:any) =&gt; void
        */
        QueryConfirmation: (query: IPowerTableRequest, scope: QueryScope, continueFn: any) => void;
        /** Gets or sets table prefetched data */
        PrefetchedData: any[];
    }
    /** Table column JSON configuration */
    interface IColumnConfiguration {
        /** Column title */
        Title: string;
        /** Column description */
        Description: string;
        /** Random metadata object that can be bound within column */
        Meta?: any;
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
        /** Is column type Enumeration */
        IsEnum: boolean;
        /** Is column nullable */
        IsNullable: boolean;
        /**
        * Javascript function used to evaluate column value on the client-side.
        *             Function signature: (dataObject:any) =&gt; any
        */
        ClientValueFunction: (a: any) => any;
        /**
        * Function that should consume IRow instance and return template name for this particular row.
        *             Return null/empty/undefined will let system to choose default template
        */
        TemplateSelector: (cell: ICell) => string;
    }
    /** Plugin JSON configuration */
    interface IPluginConfiguration {
        /** Plugin ID */
        PluginId: string;
        /** Plugin placement */
        Placement: string;
        /** Plugin configuration itself */
        Configuration: any;
        /** Plugin order among particular placement */
        Order: number;
        /** Overridable plugin template Id */
        TemplateId: string;
    }
    /** Event subscription JSON configuration */
    interface IConfiguredSubscriptionInfo {
        /** Is row event subscription mentioned */
        IsRowSubscription: boolean;
        /** Column name (must be null in case of IsRowSubscription st to true */
        ColumnName: string;
        /** Element selector (relative to row or cell) */
        Selector: string;
        /** Filtered DOM event. DomEvent class can be used here */
        DomEvent: string;
        /** Handler function */
        Handler: (dataObject: any, originalEvent: any) => void;
    }
}
declare module PowerTables {
    /**
    * Unified point of working with dates.
    *             Server side uses standard CLR DateTime type and serializing/deserializing dates using ISO 8601 Date format
    *             Client-side uses standard jsDate objects and successfully parses/converts dates from/to server
    *             Datepickers may vary. So this piece of code is single point of
    *             solving all datetime-related problems with datepickers
    */
    interface IDatepickerOptions {
        /**
        * JS function or function name to turn specified HTML element to datepicker
        *             Signature: (element:HTMLElement, isNullableDate: boolean) =&gt; void
        */
        CreateDatePicker: (element: HTMLElement, isNullableDate: boolean) => void;
        /**
        * JS function to provide datepicker with date from inside tables
        *             Signature: (element:HTMLElement, date?:Date) =&gt; void
        */
        PutToDatePicker: (element: HTMLElement, date?: Date) => void;
        /**
        * JS function used to retrieve selected date from datepicker
        *             Signature: (element:HTMLElement) =&gt; Date
        */
        GetFromDatePicker: (element: HTMLElement) => Date;
        /**
        * JS function used to retrieve selected date from datepicker
        *             Signature: (element:HTMLElement) =&gt; Date
        */
        DestroyDatepicker: (element: HTMLElement) => void;
    }
    /** Set of IDs of core templates */
    interface ICoreTemplateIds {
        /** Layout template ID (default is "layout") */
        Layout: string;
        /** Plugin wrapper template ID (default is "pluginWrapper") */
        PluginWrapper: string;
        /** Row wrapper template ID (default is "rowWrapper") */
        RowWrapper: string;
        /** Cell wrapper template ID (default is "cellWrapper") */
        CellWrapper: string;
        /** Header wrapper template ID (default is "headerWrapper") */
        HeaderWrapper: string;
        /** Banner messages template (default is "messages") */
        Messages: string;
    }
    /** JSON model for table message */
    interface ITableMessage {
        /**
        * Message type.
        *             Banners are shown instead of table data.
        *             User messages are shown using custom message display functions
        */
        Type: PowerTables.MessageType;
        /** Message title */
        Title: string;
        /** Message details (full HTML) */
        Details: string;
        /** Message class */
        Class: string;
    }
    /**
    * The respons that is being sent to client script.
    *             This entity contains query results to be shown in table and also additional data
    */
    interface IPowerTablesResponse {
        /**
        * This property is unique identifier of Lattice response.
        *             Just leave it in place and do not touch
        */
        IsLatticeResponse: boolean;
        /** Table message associated with this response */
        Message: PowerTables.ITableMessage;
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
    /** Message type enum */
    enum MessageType {
        /**
        * UserMessage is shown using specified custom functions for
        *             messages showing
        */
        UserMessage = 0,
        /** Banner message is displayed among whole table instead of data */
        Banner = 1,
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
declare module PowerTables.Plugins.Checkboxify {
    /**
    * Client configuration for Checkboxify plugin.
    *             See <see cref="T:PowerTables.Plugins.Checkboxify.CheckboxifyExtensions" />
    */
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
        CanSelectFunction: (v: any) => boolean;
    }
    /** Additional JSON data that instructs client side what selection should be set */
    interface ISelectionAdditionalData {
        /** When true, selection on table will be replaced with <see cref="P:PowerTables.Plugins.Checkboxify.SelectionAdditionalData.SelectionToReplace" /> */
        ReplaceSelection: boolean;
        /** Object IDs that must be selected instead of existing selection */
        SelectionToReplace: string[];
        /** When true, selection on table will be modified */
        ModifySelection: boolean;
        /** Adds specified keys to selection */
        AddToSelection: string[];
        /** Removes specified keys from selection */
        RemoveFromSelection: string[];
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
        IsArray: boolean;
        ArrayDelimiter: string;
    }
    interface IFormWatchFilteringsMappings {
        /** 0 = value filter, 1 = range filter, 2 = multiple filter */
        FilterType: number;
        FieldKeys: string[];
        ForServer: boolean;
        ForClient: boolean;
    }
}
declare module PowerTables.Plugins.Hideout {
    /** Client hideout plugin configuration */
    interface IHideoutPluginConfiguration {
        /** Show hideout menu or not */
        ShowMenu: boolean;
        /** Columns that are hidable at all */
        HideableColumnsNames: string[];
        /** Columns initiating table reload when their hidden/shown state changes */
        ColumnInitiatingReload: string[];
        /**
        * Columns hidout settings
        *             Key = column RawName, Value = true when hidden, false when shown
        */
        HiddenColumns: {
            [key: string]: boolean;
        };
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Filters.Range {
    /** UI configuration for range filterr */
    interface IRangeFilterUiConfig {
        /** Column name this filter associated with */
        ColumnName: string;
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
        /** Turn this filter to be working on client-side */
        ClientFiltering: boolean;
        /**
        * Specifies custom client filtering function.
        *             Function type: (datarow:any, fromValue:string, toValue:string, query:IQuery) =&gt; boolean
        *             dataRow: JSON-ed TTableObject
        *             fromValue: min. value entered to filter
        *             toValue: max. value entered to filter
        *             query: IQuery object
        *             Returns: true for satisfying objects, false otherwise
        */
        ClientFilteringFunction: (object: any, fromValue: string, toValue: string, query: IQuery) => boolean;
        /** Gets or sets ability of range filter to convert dates ranges to 1 day automatically when single day is selected */
        TreatEqualDateAsWholeDay: boolean;
        Hidden: boolean;
        DefaultTemplateId: string;
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
        /** Column name this filter associated with */
        ColumnName: string;
        /** Turn this filter to be working on client-side */
        ClientFiltering: boolean;
        /**
        * Specifies custom client filtering function.
        *             Function type: (datarow:any, filterValue:string, query:IQuery) =&gt; boolean
        *             dataRow: JSON-ed TTableObject
        *             filterValue: value entered to filter
        *             query: IQuery object
        *             Returns: true for satisfying objects, false otherwise
        */
        ClientFilteringFunction: (object: any, filterValue: string, query: IQuery) => boolean;
        /** When true, filter UI is not being rendered but client query modifier persists */
        Hidden: boolean;
        /** When true, client value filter will ignore time in case of dates filtering */
        CompareOnlyDates: boolean;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.ResponseInfo {
    interface IResponseInfoClientConfiguration {
        /**
        * Functions for calculating client-side values
        *             Key = additional field name, Value = function (set) =&gt; any to calculate
        */
        ClientCalculators: {
            [key: string]: (data: IClientDataResults) => any;
        };
        /** Client function for template rendering */
        ClientTemplateFunction: (data: any) => string;
        /** Used to point that response info resulting object has been changed */
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
    /** UI configuration for select filter */
    interface ISelectFilterUiConfig {
        /** Preselected filter value */
        SelectedValue: string;
        /** When true, option to select "Any" entry will be added to filter */
        AllowSelectNothing: boolean;
        /** When true, option to select "Any" entry will be added to filter */
        AllowSelectNotPresent: boolean;
        /** When true, ability to select multiple possible values will be available */
        IsMultiple: boolean;
        /** Column name this filter associated with */
        ColumnName: string;
        /** Select filter value list */
        Items: System.Web.Mvc.ISelectListItem[];
        Hidden: boolean;
        /** Turn this filter to be working on client-side */
        ClientFiltering: boolean;
        /**
        * Specifies custom client filtering function.
        *             Function type: (datarow:any, filterSelection:string[], query:IQuery) =&gt; boolean
        *             dataRow: JSON-ed TTableObject
        *             filterSelection: selected values
        *             query: IQuery object
        *             Returns: true for satisfying objects, false otherwise
        */
        ClientFilteringFunction: (object: any, selectedValues: string[], query: IQuery) => boolean;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.Limit {
    /**
    * Client configuration for Limit plugin.
    *             See <see cref="T:PowerTables.Plugins.Limit.LimitPluginExtensions" />
    */
    interface ILimitClientConfiguration {
        /** Value selected by default */
        DefaultValue: string;
        /** Integer values for limit menu. By default set is equal to Corresponding labels */
        LimitValues: number[];
        /** Values for limit menu. By default is { "All", "10", "50", "100" } */
        LimitLabels: string[];
        /** When true, data will be re-queried on table change */
        ReloadTableOnLimitChange: boolean;
        /**
        * When true, limiting will not be passed to server.
        *             All the limiting will be performed on client-side
        */
        EnableClientLimiting: boolean;
        DefaultTemplateId: string;
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
        /** Columns that are sortable on client-side with corresponding comparer functions */
        ClientSortableColumns: {
            [key: string]: (a: any, b: any) => number;
        };
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.Paging {
    /**
    * Client configuration for Paging plugin.
    *             See <see cref="T:PowerTables.Plugins.Paging.PagingExtensions" />
    */
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
    /** JSON configuration for toolbar button */
    interface IToolbarButtonClientConfiguration {
        /** Gets or sets value of button's 'id' HTML attribute value */
        Id: string;
        /** Gets or sets value of button's 'class' HTML attribute value */
        Css: string;
        /** Gets or sets value of button's 'style' HTML attribute value */
        Style: string;
        /** Gets or sets button's inner HTML */
        HtmlContent: string;
        /** Gets or sets command associated within this button */
        Command: string;
        /** When true, button/menu item will be disabled while command is being executed */
        BlackoutWhileCommand: boolean;
        /** Button will be disabled when nothing is checked within checkboxify plugin */
        DisableIfNothingChecked: boolean;
        /** Button title */
        Title: string;
        /** Gets or sets JS function to be executed after command execution. JS function is of type: (table:PowerTables.PowerTable, response:IPowerTablesResponse) =&gt; void */
        CommandCallbackFunction: (table: any, response: IPowerTablesResponse) => void;
        /** Gets or sets JS function to be executed before command execution with ability to confinue or reject action. JS function is of type: (continuation: ( queryModifier?:(a:IQuery) =&gt; IQuery ) =&gt; void ) =&gt; void */
        ConfirmationFunction: (continuation: (queryModifier?: (a: IQuery) => void) => void) => void;
        /** Gets or sets JS function to be executed on button click. JS function is of type: (table:any (PowerTables.PowerTable), menuElement:any)=&gt;void */
        OnClick: (table: any, menuElement: any) => void;
        /** Collection of button's submenu items */
        Submenu: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
        /** Gets value indicating where button has submenu items */
        HasSubmenu: boolean;
        /** Gets or sets value indicating whether button is menu holder */
        IsMenu: boolean;
        /** Gets or sets value indicating whether button is separator */
        Separator: boolean;
        /** Gets button id that is used internally */
        InternalId: number;
        /** Gets or sets value indicating whether button is disabled */
        IsDisabled: boolean;
        /** Gets or sets template ID for confirmation button's action */
        ConfirmationTemplateId: string;
        /** Gets or sets element selector where confirmation panel will be placed to */
        ConfirmationTargetSelector: string;
        /** Gets or sets confirmation form fields configuration */
        ConfirmationFormConfiguration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
    }
}
declare module PowerTables.Plugins.Total {
    /** Additional data that will be used to calculate totals */
    interface ITotalResponse {
        /** Totals for particular columns */
        TotalsForColumns: {
            [key: string]: any;
        };
    }
    /** Client configuration for totals */
    interface ITotalClientConfiguration {
        /** Show totals on the top of the displayed lines or not */
        ShowOnTop: boolean;
        /** Functions for formatting of received values */
        ColumnsValueFunctions: {
            [key: string]: (a: any) => string;
        };
        /** Functions for calculating totals */
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
    /** Client plugin configuration for editor plugin */
    interface IEditorUiConfig {
        /** Event that should trigger editing event. DOMEvent class can be used here */
        BeginEditEventId: string;
        /** DOM event on corresponding element that should trigger committing of edition */
        CommitEventId: string;
        /** DOM event on corresponding element that should trigger rejecting of edition */
        RejectEventId: string;
        /** Internal collection of editor's configuration for each column. Key = column ID, Value = per-column configuration object */
        EditorsForColumns: {
            [key: string]: PowerTables.Editors.ICellEditorUiConfigBase;
        };
        /**
        * Functon that will be called before saving data to server to check integrity of saving object against
        *             client loaded data
        */
        IntegrityCheckFunction: (dataObject: any) => boolean;
        DeferChanges: boolean;
        EditorType: PowerTables.Editors.EditorType;
    }
    /** Result of table edition or other action */
    interface IEditionResult {
        /** Table message associated with this response */
        Message: PowerTables.ITableMessage;
        /** Special mark to disctinguish Edition result from others on client side */
        IsUpdateResult: boolean;
        /**
        * Object which edition is confirmed.
        *             When using in-table editing, edited object will be passed here
        */
        ConfirmedObject: any;
        /** Adjustments set for table that has initiated request */
        TableAdjustments: PowerTables.Editors.IAdjustmentData;
        /**
        * Adjustments for other tables located on same page.
        *             Here: key is other table id (the same that has passed to table initialization script)
        *             value is adjustmetns set for mentioned table
        */
        OtherTablesAdjustments: {
            [key: string]: PowerTables.Editors.IAdjustmentData;
        };
    }
    /** Adjustments set for particular table */
    interface IAdjustmentData {
        /** Objects that should be removed from clien table */
        Removals: any[];
        /** Objects that should be updated in client table */
        Updates: any[];
        /**
        * Additional data being serialized for client.
        *             This field could contain anything that will be parsed on client side and corresponding actions will be performed.
        *             See <see cref="T:PowerTables.ResponseProcessing.IResponseModifier" />
        */
        AdditionalData: {
            [key: string]: any;
        };
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
    /** JSON configuration for Checkbox editor */
    interface ICheckEditorUiConfig extends PowerTables.Editors.ICellEditorUiConfigBase {
        /** Plugin ID */
        PluginId: string;
        /** Is checkbox mandatory to be checked */
        IsMandatory: boolean;
    }
}
declare module PowerTables.Editors.PlainText {
    interface IPlainTextEditorUiConfig extends PowerTables.Editors.ICellEditorUiConfigBase {
        PluginId: string;
        ValidationRegex: string;
        EnableBasicValidation: boolean;
        FormatFunction: (value: any, column: IColumn) => string;
        ParseFunction: (value: string, column: IColumn, errors: PowerTables.Editors.IValidationMessage[]) => any;
        FloatRemoveSeparatorsRegex: string;
        FloatDotReplaceSeparatorsRegex: string;
        AllowEmptyString: boolean;
        MaxAllowedLength: number;
    }
}
declare module PowerTables.Plugins.LoadingOverlap {
    interface ILoadingOverlapUiConfig {
        Overlaps: {
            [key: string]: string;
        };
        DefaultTemplateId: string;
    }
    enum OverlapMode {
        All = 0,
        BodyOnly = 1,
    }
}
declare module PowerTables.Plugins.Reload {
    /** Client configuration for Reload plugin */
    interface IReloadUiConfiguration {
        /** Should table be reloaded forcibly */
        ForceReload: boolean;
        /** Selector where to render reload button */
        RenderTo: string;
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.Hierarchy {
    /** Client-side configuration of hierarchy plugin */
    interface IHierarchyUiConfiguration {
        /** Gets or sets expansion behavior. Options are - to load collapsed nodes contents from server-side everywhere or try to fetch from local cache */
        ExpandBehavior: PowerTables.Plugins.Hierarchy.NodeExpandBehavior;
        /** Gets or sets tree filtering behavior. Setting this option to ExcludeCollapsed will disallow searching inside collapsed nodes */
        CollapsedNodeFilterBehavior: PowerTables.Plugins.Hierarchy.TreeCollapsedNodeFilterBehavior;
    }
    /** Controls policy of nodes collapsing and expanding */
    enum NodeExpandBehavior {
        /** This option will not fetch subtree nodes when locally loaded data available */
        LoadFromCacheWhenPossible = 0,
        /**
        * This option will make hierarchy plugin always fetch subtree from
        *             server-side even if local data available
        */
        AlwaysLoadRemotely = 1,
    }
    /** This option controls client filtering policy related to collapsed nodes */
    enum TreeCollapsedNodeFilterBehavior {
        /** In this case, even collapsed nodes will be included to filter results */
        IncludeCollapsed = 0,
        /** In this case, even collapsed nodes will be excluded from filter results */
        ExcludeCollapsed = 1,
    }
}
declare module PowerTables.Plugins.RowAction {
    interface IRowActionUiConfiguration {
        RowActionDescriptions: {
            [key: string]: PowerTables.Plugins.RowAction.IClientRowActionDescription;
        };
    }
    /** JSON configuration for client row action */
    interface IClientRowActionDescription {
        /** Gets or sets command associated within client action */
        Command: string;
        /** Gets or sets template ID for confirmation button's action */
        ConfirmationTemplateId: string;
        /** Gets or sets element selector where confirmation panel will be placed to */
        ConfirmationTargetSelector: string;
        /** Gets or sets confirmation form fields configuration */
        ConfirmationFormConfiguration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
        /** Gets or sets JS function to be executed after command execution. JS function is of type: (table:PowerTables.PowerTable, response:IPowerTablesResponse) =&gt; void */
        CommandCallbackFunction: (table: any, response: IPowerTablesResponse) => void;
        /** Gets or sets JS function to be executed before command execution with ability to confinue or reject action. JS function is of type: (continuation: ( queryModifier?:(a:IQuery) =&gt; IQuery ) =&gt; void ,table:any (PowerTables.PowerTable)) =&gt; void */
        ConfirmationFunction: (continuation: (queryModifier?: (a: IQuery) => void) => void) => void;
        /** Gets or sets JS function to be executed when action happens. JS function is of type: (table:any (PowerTables.PowerTable), menuElement:any)=&gt;void */
        OnTrigger: (e: any) => void;
        /** Gets or sets URL that HTML content will be loaded from for particular row. Row object will be passed as QueryString parameter */
        UrlToLoad: string;
    }
}
declare module PowerTables {
    /**
    * Helper class for producing track ids.
    * You can use this class directly, but it is better to use it via @memberref PowerTables.PowerTable.Renderer.Rendering.Modifier instance
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
     * Plugin interface.
     * Leave both render functions null to obtain non-displaying plugin
     */
    interface IPlugin extends IRenderable {
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
        proceedAdjustments(adjustments: PowerTables.Editors.IAdjustmentData): void;
        /**
        * API for table messages
        */
        MessageService: MessagesService;
        getStaticData(): any;
        setStaticData(obj: any): void;
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
    /**
     * Renderable entity
     */
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
    /**
     * Cell object
     */
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
    interface IColumn {
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
        /**
         * Flag for special column that has plugin purpose and does not holds data
         */
        IsSpecial?: boolean;
    }
    interface IUiMessage extends ITableMessage {
        UiColumnsCount: number;
        IsMessageObject?: boolean;
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
         * Creates datepicker object of HTML element using configured function
         *
         * @param element HTML element that should be converted to datepicker
         */
        destroyDatePicker(element: HTMLElement): void;
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
    /**
     * API for managing in-table elements' events
     */
    class EventsDelegator {
        /**
         * @internal
         */
        constructor(locator: PowerTables.Rendering.DOMLocator, bodyElement: HTMLElement, layoutElement: HTMLElement, rootId: string, masterTable: IMasterTable);
        private static addHandler(element, type, handler);
        private static removeHandler(element, type, handler);
        private _masterTable;
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
        private _destroyCallbacks;
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
        /**
         * @internal
         */
        subscribeEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]): void;
        private onOutTableEvent(e);
        /**
         * @internal
         */
        subscribeOutOfElementEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]): void;
        /**
         * Subscribes event that will be fired when supplied element will be destroyed
         *
         * @param e HTML element destroying of which will fire event
         * @param callback Callback being called when element is destroyed
         */
        subscribeDestroy(e: HTMLElement, callback: PowerTables.Rendering.ICallbackDescriptor): void;
        /**
         * @internal
         */
        handleElementDestroy(e: HTMLElement): void;
        private collectElementsHavingAttribute(parent, attribute);
    }
    interface IRowEventArgs {
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
        BeforeAdjustment: TableEvent<PowerTables.Editors.IAdjustmentData>;
        AfterAdjustment: TableEvent<PowerTables.Editors.IAdjustmentData>;
        AdjustmentResult: TableEvent<IAdjustmentResult>;
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
        /**
         * @internal
         */
        constructor(masterTable: IMasterTable);
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
        /**
         * Redraws locally visible data
         */
        replaceVisibleData(rows: IRow[]): void;
        /**
         * @internal
         */
        drawAdjustmentResult(adjustmentResult: IAdjustmentResult): void;
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
}
declare module PowerTables {
    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    class DataHolder {
        constructor(masterTable: IMasterTable);
        private _rawColumnNames;
        private _comparators;
        private _filters;
        private _anyClientFiltration;
        private _events;
        private _instances;
        private _masterTable;
        private _clientValueFunction;
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
        getClientFilters(): IClientFilter[];
        clearClientFilters(): void;
        /**
         * Registers new client ordering comparer function
         *
         * @param dataField Field for which this comparator is applicable
         * @param comparator Comparator fn that should return 0 if entries are equal, -1 if a<b, +1 if a>b
         * @returns {}
         */
        registerClientOrdering(dataField: string, comparator: (a: any, b: any) => number, mandatory?: boolean): void;
        private _manadatoryOrderings;
        private isClientFiltrationPending();
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
        private skipTakeSet(ordered, query);
        /**
         * Part of data currently displayed without ordering and paging
         */
        Filtered: any[];
        /**
         * Part of data currently displayed without paging
         */
        Ordered: any[];
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
        localLookup(predicate: (object: any) => boolean, setToLookup?: any[]): ILocalLookupResult[];
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
        localLookupPrimaryKey(dataObject: any, setToLookup?: any[]): ILocalLookupResult;
        private copyData(source, target);
        private normalizeObject(dataObject);
        proceedAdjustments(adjustments: PowerTables.Editors.IAdjustmentData): IAdjustmentResult;
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
        Configuration: Configuration.Json.ITableConfiguration;
        private _rawColumnNames;
        private _masterTable;
        private _isHandlingSpecialPlacementCase;
        private _specialCasePlaceholder;
        private static _datetimeTypes;
        private static _stringTypes;
        private static _floatTypes;
        private static _integerTypes;
        private static _booleanTypes;
        static classifyType(fieldType: string): IClassifiedType;
        private initColumns();
        initPlugins(): void;
        private static startsWith(s1, prefix);
        private static endsWith(s1, postfix);
        _subscribeConfiguredEvents(): void;
        /**
        * Reteives plugin at specified placement
        * @param pluginId Plugin ID
        * @param placement Pluign placement
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
    interface IClassifiedType {
        IsDateTime: boolean;
        IsString: boolean;
        IsFloat: boolean;
        IsInteger: boolean;
        IsBoolean: boolean;
        IsNullable: boolean;
    }
}
declare module PowerTables {
    /**
     * Component that is responsible for querying server
     */
    class Loader {
        constructor(staticData: any, operationalAjaxUrl: string, masterTable: IMasterTable);
        private _queryPartProviders;
        private _previousRequest;
        private _staticData;
        private _operationalAjaxUrl;
        private _events;
        private _dataHolder;
        private _isFirstTimeLoading;
        private _masterTable;
        /**
         * Registers new query part provider to be used while collecting
         * query data before sending it to server.
         *
         * @param provider instance implementing IQueryPartProvider interface
         * @returns {}
         */
        registerQueryPartProvider(provider: IQueryPartProvider): void;
        prefetchData(data: any[]): void;
        private gatherQuery(queryScope);
        private getXmlHttp();
        private _previousQueryString;
        private checkError(json, data, req);
        private checkMessage(json);
        private checkEditResult(json, data, req);
        private handleRegularJsonResponse(req, data, clientQuery, callback, errorCallback);
        private handleDeferredResponse(req, data, callback);
        isLoading(): boolean;
        private doServerQuery(data, clientQuery, callback, errorCallback?);
        private _isLoading;
        /**
         * Sends specified request to server and lets table handle it.
         * Always use this method to invoke table's server functionality because this method
         * correctly rises all events, handles errors etc
         *
         * @param command Query command
         * @param callback Callback that will be invoked after data received
         * @param queryModifier Inline query modifier for in-place query modification
         * @param errorCallback Will be called if error occures
         */
        requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?: boolean): void;
    }
}
declare module PowerTables.Rendering {
    /**
     * Internal component that is not supposed to be used directly.
     */
    class BackBinder {
        private _eventsQueue;
        private _markQueue;
        private _datepickersQueue;
        private _callbacksQueue;
        private _destroyCallbacksQueue;
        private _instances;
        private _stack;
        private _dateService;
        private _stealer;
        private _cachedVisualStates;
        private _hasVisualStates;
        Delegator: EventsDelegator;
        /**
   * @internal
   */
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
        private evalCallback(calbackString);
        private traverseWindowPath(path);
        private resolveNormalStates(targets);
        private addNormalState(states, target);
        private mixinToNormal(normal, custom);
        private bindEventHelper();
        private renderCallbackHelper();
        private destroyCallbackHelper();
        private markHelper(fieldName, key, receiverPath);
        private datepickerHelper(columnName, forceNullable);
        private visualStateHelper(stateName, stateJson);
    }
    /**
   * @internal
   */
    interface ICallbackDescriptor {
        Element?: HTMLElement;
        Callback: any;
        CallbackArguments: any[];
        Target: any;
    }
    interface IState {
        /**
         * HTML element this state is applicable to
         */
        Element: HTMLElement;
        /**
         * Object that owns mentioned HTML element
         */
        Receiver: any;
        /**
         * State ID
         */
        id: string;
        /**
         * Classes to add/remove
         */
        classes: string[];
        /**
         * Attributes values in desired state
         */
        attrs: {
            [key: string]: string;
        };
        /**
         * Styles to be changed in desired state
         */
        styles: {
            [key: string]: string;
        };
        /**
         * Element HTML content to be set in particular state
         */
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
         */
        renderBody(rows: IRow[]): string;
        renderCell(cell: ICell): string;
        renderContent(columnName?: string): string;
        private renderCellAsPartOfRow(cell, cellWrapper);
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
    /**
     * Class that is responsible for particular HTML elements redrawing/addition/removal
     */
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
        hideElement(el: HTMLElement): void;
        showElement(el: HTMLElement): void;
        private destroyElement(element);
        private destroyElements(elements);
        hideElements(element: NodeList): void;
        showElements(element: NodeList): void;
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
        /**
         * Parses supplied HTML string and promotes it to HTML element.
         * This implementation also supports <script/> tags inside of supplied HTML. Scripts will be executed
         * immediately after HTML element creation.
         *
         * @param html HTML string to convert to HTML element
         */
        html2Dom(html: string): HTMLElement;
        /**
        * Parses supplied HTML string and promotes it to set of HTML elements.
        * This implementation also supports <script/> tags inside of supplied HTML. Scripts will be executed
        * immediately after all of HTML elements creation.
        *
        * @param html HTML string to convert to HTML element
        */
        html2DomElements(html: string): HTMLElement[];
    }
}
declare module PowerTables.Rendering {
    /**
     * Rendering stack class. Provives common helper
     * infrastructure for context-oriented rendering
     * @internal
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
        /**
         * Custom rendering object.
         * Needed for rendering of random templates bound to random objects
         */
        Custom = 4,
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
        /**
        * @internal
        */
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
        constructor(rootId: string, prefix: string, masterTable: IMasterTable);
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
        private _masterTable;
        private _instances;
        private _stack;
        private _datepickerFunction;
        private _templatesCache;
        private _rootId;
        private _events;
        private _templateIds;
        private _prefix;
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
        renderObject(templateId: string, viewModelBehind: any, targetSelector: string): HTMLElement;
        destroyObject(targetSelector: string): void;
        /**
         * Removes all dynamically loaded content in table
         *
         * @returns {}
         */
        clearBody(): void;
        contentHelper(columnName?: string): string;
        private trackHelper();
        private ifqHelper(a, b, opts);
        private ifcompHelper(a, b, comparison, opts);
        private iflocHelper(location, opts);
        hasCachedTemplate(templateId: string): boolean;
    }
}
declare module PowerTables.Rendering {
    /**
     * Component for managing components visual states
     */
    class VisualState {
        /**
        * @internal
        */
        constructor();
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
    /**
    * @internal
    */
    interface IStateChangedEvent {
        State: string;
        CurrentState: string;
        StateWasMixedIn: boolean;
    }
}
declare module PowerTables {
    /**
     * Main entry point for all tables functionality
     */
    class PowerTable implements IMasterTable {
        /**
         * Constructs new instance of PowerTable object.
         * Usually this method is being called automatically by .InitializationCode or .InitializationScript method,
         * but you also could combine call of Configurator<>.JsonConfig and call of Lattice constructor
         *
         * @param configuration JSON configuration of whole table
         */
        constructor(configuration: Configuration.Json.ITableConfiguration);
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
        reload(force: boolean): void;
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
         * API for table messages
         */
        MessageService: MessagesService;
        /**
         * Fires specified DOM event on specified element
         *
         * @param eventName DOM event id
         * @param element Element is about to dispatch event
         */
        static fireDomEvent(eventName: string, element: HTMLElement): void;
        proceedAdjustments(adjustments: PowerTables.Editors.IAdjustmentData): void;
        getStaticData(): any;
        setStaticData(obj: any): void;
    }
}
declare module PowerTables.Plugins {
    /**
     * Base class for plugins.
     * It contains necessary infrastructure for convinence of plugins creation
     */
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
declare module PowerTables.Filters {
    /**
     * Base class for creating filters
     */
    class FilterBase<T> extends PowerTables.Plugins.PluginBase<T> implements IQueryPartProvider, IClientFilter {
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
declare module PowerTables.Plugins.Ordering {
    class OrderingPlugin extends PowerTables.Filters.FilterBase<IOrderingConfiguration> {
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
        protected nextOrdering(currentOrdering: PowerTables.Ordering): PowerTables.Ordering;
        private makeDefaultOrderingFunction(fieldName);
        init(masterTable: IMasterTable): void;
        private mixinOrderings(orderingsCollection, query);
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }
}
declare module PowerTables.Plugins.Limit {
    class LimitPlugin extends PowerTables.Filters.FilterBase<Plugins.Limit.ILimitClientConfiguration> {
        SelectedValue: ILimitSize;
        private _limitSize;
        Sizes: ILimitSize[];
        renderContent(templatesProvider: ITemplatesProvider): string;
        changeLimitHandler(e: Rendering.ITemplateBoundEvent): void;
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
declare module PowerTables.Plugins.Paging {
    class PagingPlugin extends PowerTables.Filters.FilterBase<Plugins.Paging.IPagingClientConfiguration> {
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
        gotoPageClick(e: Rendering.ITemplateBoundEvent): void;
        navigateToPage(e: Rendering.ITemplateBoundEvent): void;
        nextClick(e: Rendering.ITemplateBoundEvent): void;
        previousClick(e: Rendering.ITemplateBoundEvent): void;
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
        Next?: boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }
}
declare module PowerTables.Filters.Value {
    /**
     * Client-side part of value filter
     */
    class ValueFilterPlugin extends PowerTables.Filters.FilterBase<Filters.Value.IValueFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _previousValue;
        AssociatedColumn: IColumn;
        private _isInitializing;
        /**
         * HTML element corresponding to <input/> tag this filter will retrieve value from
         */
        FilterValueProvider: HTMLInputElement;
        /**
         * Retrieves entered value. Could be either string or Date object depending on
         * column associated within filter
         */
        getValue(): any;
        /**
        * @internal
        */
        handleValueChanged(): void;
        /**
        * @internal
        */
        renderContent(templatesProvider: ITemplatesProvider): string;
        /**
        * @internal
        */
        init(masterTable: IMasterTable): void;
        /**
        * @internal
        */
        filterPredicate(rowObject: any, query: IQuery): boolean;
        /**
        * @internal
        */
        modifyQuery(query: IQuery, scope: QueryScope): void;
        /**
        * @internal
        */
        afterDrawn: (e: any) => void;
    }
}
declare module PowerTables.Filters.Range {
    class RangeFilterPlugin extends PowerTables.Filters.FilterBase<Filters.Range.IRangeFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _fromPreviousValue;
        private _toPreviousValue;
        AssociatedColumn: IColumn;
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
declare module PowerTables.Filters.Select {
    /**
     * Client-side implementation of Select filter
     */
    class SelectFilterPlugin extends PowerTables.Filters.FilterBase<Filters.Select.ISelectFilterUiConfig> {
        /**
         * HTML element of select list supplying values for select filter.
         */
        FilterValueProvider: HTMLSelectElement;
        AssociatedColumn: IColumn;
        /**
         * Retrieves selected values serialized with |-delimiter
         */
        getSerializedValue(): string;
        /**
         * Retrieves array of stringified selected values
         */
        getArrayValue(): string[];
        /**
         * @internal
         */
        modifyQuery(query: IQuery, scope: QueryScope): void;
        /**
         * @internal
         */
        renderContent(templatesProvider: ITemplatesProvider): string;
        /**
         * @internal
         */
        handleValueChanged(): void;
        /**
         * @internal
         */
        init(masterTable: IMasterTable): void;
        /**
         * @internal
         */
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }
}
declare module PowerTables.Plugins.Hideout {
    interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
        DoesNotExists: boolean;
    }
    class HideoutPlugin extends PluginBase<PowerTables.Plugins.Hideout.IHideoutPluginConfiguration> implements IQueryPartProvider {
        ColumnStates: IColumnState[];
        private _columnStates;
        private _isInitializing;
        isColumnVisible(columnName: string): boolean;
        isColumnInstanceVisible(col: IColumn): boolean;
        hideColumnByName(rawColname: string): void;
        showColumnByName(rawColname: string): void;
        toggleColumn(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        showColumn(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        hideColumn(e: PowerTables.Rendering.ITemplateBoundEvent): void;
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
        private ifColVisibleHelper(columnName, opts);
        registerAdditionalHelpers(hb: Handlebars.IHandlebars): void;
    }
}
declare module PowerTables.Plugins.ResponseInfo {
    class ResponseInfoPlugin extends PluginBase<Plugins.ResponseInfo.IResponseInfoClientConfiguration> {
        private _recentData;
        private _recentServerData;
        private _recentTemplate;
        private _pagingEnabled;
        private _pagingPlugin;
        private _isServerRequest;
        private _isReadyForRendering;
        onResponse(e: ITableEventArgs<IDataEventArgs>): void;
        private addClientData(e);
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        init(masterTable: IMasterTable): void;
    }
}
declare module PowerTables.Plugins.Total {
    /**
     * Client-side implementation of totals plugin
     */
    class TotalsPlugin extends PluginBase<Plugins.Total.ITotalClientConfiguration> {
        private _totalsForColumns;
        private makeTotalsRow();
        /**
        * @internal
        */
        onResponse(e: ITableEventArgs<IDataEventArgs>): void;
        /**
        * @internal
        */
        onClientRowsRendering(e: ITableEventArgs<IRow[]>): void;
        /**
        * @internal
        */
        private onAdjustments(e);
        /**
        * @internal
        */
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        /**
        * @internal
        */
        subscribe(e: EventsManager): void;
    }
}
declare module PowerTables.Plugins.Checkboxify {
    class CheckboxifyPlugin extends PluginBase<Plugins.Checkboxify.ICheckboxifyClientConfig> implements IQueryPartProvider {
        private _selectedItems;
        private _visibleAll;
        private _allSelected;
        private _ourColumn;
        ValueColumnName: string;
        private _canSelectAll;
        private _pagingPlugin;
        private _selectables;
        selectAll(selected?: boolean): void;
        private redrawHeader();
        private createColumn();
        private canCheck(dataObject, row);
        getSelection(): string[];
        resetSelection(): void;
        selectByRowIndex(rowIndex: number, select?: boolean): boolean;
        selectByDataObject(dataObject: any, select?: boolean): boolean;
        selectByPredicate(predicate: (dataObject: any) => boolean, select?: boolean): boolean;
        private toggleInternal(dataObject, displayedIndex, select?);
        private afterLayoutRender();
        private beforeRowsRendering(e);
        private enableSelectAll(enabled);
        private onClientReload(e);
        private onServerReload(e);
        private applySelection(a);
        private onBeforeAdjustments(e);
        private onAfterAdjustments(e);
        init(masterTable: IMasterTable): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        static registerEvents(e: EventsManager, masterTable: IMasterTable): void;
        subscribe(e: EventsManager): void;
    }
}
declare module PowerTables.Plugins.Toolbar {
    /**
     * Client-side supply for Toolbar plugin
     */
    class ToolbarPlugin extends PluginBase<Plugins.Toolbar.IToolbarButtonsClientConfiguration> {
        /**
         * HTML elements of all buttons that are registered for usage within toolbar plugin. Key= internal button id, Value = HTML element corresponding to button
         */
        AllButtons: {
            [id: number]: HTMLElement;
        };
        private _buttonsConfig;
        /**
         * Simulates event happened on particular button. Internal button id must be supplied as first member of @memberref PowerTables.Rendering.ITemplateBoundEvent.EventArguments
         *
         * @param e Template bound event for triggering button action
         */
        buttonHandleEvent(e: Rendering.ITemplateBoundEvent): void;
        private redrawMe();
        private handleButtonAction(btn);
        renderContent(templatesProvider: ITemplatesProvider): string;
        private traverseButtons(arr);
        private onSelectionChanged(e);
        init(masterTable: IMasterTable): void;
    }
}
declare module PowerTables.Plugins.Formwatch {
    class FormwatchPlugin extends PluginBase<PowerTables.Plugins.Formwatch.IFormwatchClientConfiguration> implements IQueryPartProvider {
        private _existingValues;
        private _filteringExecuted;
        private _timeouts;
        private static extractValueFromMultiSelect(o);
        private static extractInputValue(element, fieldConf, dateService);
        private static extractData(elements, fieldConf, dateService);
        static extractFormData(configuration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[], rootElement: any, dateService: DateService): {};
        modifyQuery(query: IQuery, scope: QueryScope): void;
        subscribe(e: EventsManager): void;
        fieldChange(fieldSelector: string, delay: number, element: HTMLInputElement, e: Event): void;
        init(masterTable: IMasterTable): void;
    }
}
declare module PowerTables.Editors {
    class Editor extends PowerTables.Plugins.PluginBase<PowerTables.Editors.IEditorUiConfig> implements IRow {
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
        notifyChanged(editor: PowerTables.Editors.ICellEditor): void;
        commitAll(): void;
        private dispatchEditResponse(editResponse, then);
        private sendDataObjectToServer(then);
        commit(editor: PowerTables.Editors.ICellEditor): void;
        redrawEditingRow(collectData: boolean): void;
        redrawMe(editor: PowerTables.Editors.ICellEditor): void;
        private cleanupAfterEdit();
        rejectAll(): void;
        private finishEditing(editor, redraw);
        reject(editor: PowerTables.Editors.ICellEditor): void;
        private retrieveEditorData(editor, errors?);
        private retrieveAllEditorsData();
        private ensureEditing(rowDisplayIndex);
        private isEditable(column);
        private createEditor(column, canComplete, isForm, isRow);
        private beginCellEdit(column, rowIndex);
        private beginRowEdit(rowIndex);
        private setEditorValue(editor);
        onBeforeClientRowsRendering(e: ITableEventArgs<IRow[]>): void;
        onAfterDataRendered(e: any): void;
        beginCellEditHandle(e: ICellEventArgs): void;
        beginRowEditHandle(e: IRowEventArgs): void;
        commitRowEditHandle(e: IRowEventArgs): void;
        rejectRowEditHandle(e: IRowEventArgs): void;
        beginFormEditHandle(e: IRowEventArgs): void;
        commitFormEditHandle(e: IRowEventArgs): void;
        rejectFormEditHandle(e: IRowEventArgs): void;
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
declare module PowerTables.Editors {
    class CellEditorBase<T> extends PowerTables.Plugins.PluginBase<T> implements PowerTables.Editors.ICellEditor {
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
        * True when cell editor is editing cell
        */
        IsCellEdit: boolean;
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
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        /**
         * Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditor
         * Commit leads to validation. Cell editor should be notified
         */
        commitHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        /**
         * Event handler for reject (cancel editing) event raised from inside of CellEditor
         * Cell editor should be notified
         */
        rejectHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
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
        * True when cell editor is editing cell
        */
        IsCellEdit: boolean;
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
    interface IValidationMessage {
        Message: string;
        Code: string;
    }
}
declare module PowerTables.Editors.PlainText {
    class PlainTextEditor extends PowerTables.Editors.CellEditorBase<PowerTables.Editors.PlainText.IPlainTextEditorUiConfig> {
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
declare module PowerTables.Editors.SelectList {
    class SelectListEditor extends PowerTables.Editors.CellEditorBase<PowerTables.Editors.SelectList.ISelectListEditorUiConfig> {
        List: HTMLSelectElement;
        Items: System.Web.Mvc.ISelectListItem[];
        SelectedItem: System.Web.Mvc.ISelectListItem;
        getValue(errors: PowerTables.Editors.IValidationMessage[]): any;
        setValue(value: any): void;
        onStateChange(e: PowerTables.Rendering.IStateChangedEvent): void;
        init(masterTable: IMasterTable): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        onAfterRender(e: HTMLElement): void;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        focus(): void;
    }
}
declare module PowerTables.Plugins.LoadingOverlap {
    class LoadingOverlapPlugin extends PluginBase<PowerTables.Plugins.LoadingOverlap.ILoadingOverlapUiConfig> {
        private _overlappingElement;
        private _overlapLayer;
        private _isOverlapped;
        private overlapAll();
        private createOverlap(efor, templateId);
        private updateCoords(overlapLayer, overlapElement);
        private updateCoordsAll();
        private deoverlap();
        private onBeforeLoading(e);
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
declare module PowerTables.Editors.Check {
    class CheckEditor extends PowerTables.Editors.CellEditorBase<PowerTables.Editors.Check.ICheckEditorUiConfig> {
        FocusElement: HTMLElement;
        private _value;
        renderContent(templatesProvider: ITemplatesProvider): string;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        private updateState();
        getValue(errors: PowerTables.Editors.IValidationMessage[]): any;
        setValue(value: any): void;
        focus(): void;
    }
}
declare module PowerTables.Editors.Memo {
    class MemoEditor extends PowerTables.Editors.CellEditorBase<PowerTables.Editors.Memo.IMemoEditorUiConfig> {
        TextArea: HTMLInputElement;
        MaxChars: number;
        CurrentChars: number;
        Rows: number;
        WarningChars: number;
        Columns: number;
        init(masterTable: IMasterTable): void;
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        setValue(value: any): void;
        getValue(errors: PowerTables.Editors.IValidationMessage[]): any;
        renderContent(templatesProvider: ITemplatesProvider): string;
        focus(): void;
    }
}
declare module PowerTables.Plugins.Toolbar {
    /**
     * Backing class for confirmation panel created as part of button action
     */
    class CommandConfirmation {
        /**
         * @internal
         */
        constructor(confirm: (form: any) => void, reject: () => void, date: DateService, autoform: PowerTables.Plugins.Formwatch.IFormwatchFieldData[]);
        private _autoform;
        private _confirm;
        private _reject;
        private _date;
        private _beforeConfirm;
        /**
         * @internal
         */
        AfterConfirm: ((form: any) => void)[];
        private _beforeReject;
        /**
         * @internal
         */
        AfterReject: ((form: any) => void)[];
        /**
         * @internal
         */
        AfterConfirmationResponse: ((form: any) => void)[];
        /**
         * @internal
         */
        ConfirmationResponseError: ((form: any) => void)[];
        /**
         * Set of form values (available only after window is commited or dismissed)
         */
        Form: any;
        /**
         * Reference to root element of confirmation window
         */
        RootElement: HTMLElement;
        /**
         * Set of selected item keys defined in corresponding Checboxify plugin
         */
        SelectedItems: string[];
        /**
         * Set of selected corresponding objects selected by checkboxify plugin
         */
        SelectedObjects: any[];
        /**
         * @internal
         */
        onRender(parent: HTMLElement): void;
        /**
         * @internal
         */
        fireEvents(form: any, array: ((form: any) => void)[]): void;
        private collectFormData();
        /**
         * Commits confirmation form, collects form, destroys confirmation panel element and proceeds server command, fires corresponding events
         */
        confirm(): void;
        /**
         * Destroys confirmation panel element, collects form, does not send anything to server, fires corresponding events
         */
        dismiss(): void;
        /**
         * Subscribes specified function to be invoked after pressing confirm button (or calling confirm method) but before processing
         * @param fn Function that consumes form data
         */
        onBeforeConfirm(fn: (form: any) => void): void;
        /**
         * Subscribes specified function to be invoked after pressing confirm button and client-side form processing (it is possible to add something to form)
         * but before sending data to server
         * @param fn Function that consumes form data
         */
        onAfterConfirm(fn: (form: any) => void): void;
        /**
         * Subscribes specified function to be invoked after pressing reject button (or calling reject method) but before processing
         * @param fn Function that consumes form data
         */
        onBeforeReject(fn: (form: any) => void): void;
        /**
         * Subscribes specified function to be invoked after pressing reject button (or calling reject method) but before processing
         * @param fn Function that consumes form data
         */
        onAfterReject(fn: (form: any) => void): void;
        onAfterConfirmationResponse(fn: (form: any) => void): void;
        onConfirmationResponseError(fn: (form: any) => void): void;
    }
}
declare module PowerTables {
    /**
     * Class responsible for handling of table messages. It handles internally thrown messages as well as
     * user's ones
     */
    class MessagesService {
        constructor(usersMessageFn: (msg: ITableMessage) => void, instances: InstanceManager, dataHolder: DataHolder, controller: Controller, templatesProvider: ITemplatesProvider);
        private _usersMessageFn;
        private _instances;
        private _dataHolder;
        private _controller;
        private _templatesProvider;
        /**
         * Shows table message according to its settings
         * @param message Message of type ITableMessage
         * @returns {}
         */
        showMessage(message: ITableMessage): void;
        private showTableMessage(tableMessage);
    }
}
declare module PowerTables.Plugins.Reload {
    class ReloadPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.Reload.IReloadUiConfiguration> {
        private _renderedExternally;
        private _externalReloadBtn;
        private _ready;
        triggerReload(): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        startLoading(): void;
        stopLoading(): void;
        subscribe(e: EventsManager): void;
        init(masterTable: IMasterTable): void;
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
declare module PowerTables.Plugins.Loading {
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
declare module PowerTables.Plugins.RowAction {
    class RowAction extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.RowAction.IClientRowActionDescription> {
        init(masterTable: IMasterTable): void;
    }
}
declare module PowerTables.Plugins.Hierarchy {
    class HierarchyPlugin extends PluginBase<IHierarchyUiConfiguration> implements IClientFilter {
        expandSubtree(args: IRowEventArgs): void;
        collapseSubtree(args: IRowEventArgs): void;
        toggleSubtree(args: IRowEventArgs): void;
        toggleSubtreeByObject(dataObject: any, turnOpen?: boolean, index?: number): void;
        private expand(dataObject, index);
        private toggleVisibleRec(dataObject);
        private collapse(dataObject, index);
        private collapseChildren(dataObject);
        init(masterTable: IMasterTable): void;
        private hierarchicalOrder(a, b);
        private refilterStoredData();
        private _hierarchyFiltered;
        private stackOrder(data);
        private recalculateSubtreeReferences(e);
        private _isFunctionsStolen;
        private _stolenFilterFunctions;
        private stealFilterFunctions();
        private onAfterClientDataProcessing(e);
        subscribe(e: EventsManager): void;
        private onAfterLayoutRendered();
        filterPredicate(rowObject: any, query: IQuery): boolean;
        private onBeforeClientDataProcessing();
    }
}
declare module PowerTables.Commands {
    class CommandsConfirmationWindowViewModel {
    }
}
declare module PowerTables.Commands {
    class CommandsService {
    }
}
