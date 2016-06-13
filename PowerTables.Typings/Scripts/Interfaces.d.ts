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
        /** Is column type Enumeration */
        IsEnum: boolean;
        /** Is column nullable */
        IsNullable: boolean;
        /**
        * Javascript function used to evaluate column value on the client-side.
        *             Function signature: (dataObject:any) =&gt; any
        */
        ClientValueFunction: (a: any) => any;
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
        DefaultTemplateId: string;
    }
}
declare module PowerTables.Plugins.ResponseInfo {
    interface IResponseInfoClientConfiguration {
        /** Client function for evaluating template information */
        ClientEvaluationFunction: (data: IClientDataResults, currentPage: number, totalPages: number) => any;
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
        InternalId: number;
        IsDisabled: boolean;
        ConfirmationTemplateId: string;
        ConfirmationTargetSelector: string;
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
        ParseFunction: (value: string, column: IColumn, errors: PowerTables.Plugins.IValidationMessage[]) => any;
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
