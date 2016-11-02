//     This code was generated by a Reinforced.Typings tool. 
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.


module PowerTables.Configuration.Json {
	/** Configuration JSON object for whole table */
	export interface ITableConfiguration
	{
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
		/** Function that will be called after tables initialization */
		CallbackFunction: (table:IMasterTable) => void;
		/**
		* Function that should consume IRow instance and return template name for this particular row.
		*             Return null/empty/undefined will let system to choose default template
		*/
		TemplateSelector: (row:IRow)=>string;
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
		QueryConfirmation: (query:IPowerTableRequest,scope:QueryScope,continueFn:any) => void;
		/** Configuration of selection mechanism */
		SelectionConfiguration: PowerTables.Configuration.Json.ISelectionConfiguration;
		/** Gets or sets table prefetched data */
		PrefetchedData: any[];
	}
	/** Table column JSON configuration */
	export interface IColumnConfiguration
	{
		/** Column title */
		Title: string;
		/** Column display order */
		DisplayOrder: number;
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
		CellRenderingValueFunction: (a:any) => string;
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
		ClientValueFunction: (a:any) => any;
		/**
		* Function that should consume IRow instance and return template name for this particular row.
		*             Return null/empty/undefined will let system to choose default template
		*/
		TemplateSelector: (cell:ICell)=>string;
		/** Special column does not represent any data and supposed to be handled by plugin from inside table */
		IsSpecial: boolean;
	}
	/** Plugin JSON configuration */
	export interface IPluginConfiguration
	{
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
	export interface IConfiguredSubscriptionInfo
	{
		/** Is row event subscription mentioned */
		IsRowSubscription: boolean;
		/** Column name (must be null in case of IsRowSubscription st to true */
		ColumnName: string;
		/** Element selector (relative to row or cell) */
		Selector: string;
		/** Filtered DOM event. DomEvent class can be used here */
		DomEvent: string;
		/** Handler function */
		Handler: (dataObject:any, originalEvent:any) => void;
	}
	export interface ISelectionConfiguration
	{
		SelectAllBehavior: PowerTables.Configuration.Json.SelectAllBehavior;
		CanSelectRowFunction: (dataObject:any)=>boolean;
		CanSelectCellFunction: (dataObject:any,column:string,select:boolean)=>boolean;
		NonselectableColumns: string[];
	}
	export enum SelectAllBehavior { 
		AllVisible = 0, 
		OnlyIfAllDataVisible = 1, 
		AllLoadedData = 2, 
	}
}
module PowerTables {
	/**
	* Unified point of working with dates. 
	*             Server side uses standard CLR DateTime type and serializing/deserializing dates using ISO 8601 Date format
	*             Client-side uses standard jsDate objects and successfully parses/converts dates from/to server
	*             Datepickers may vary. So this piece of code is single point of 
	*             solving all datetime-related problems with datepickers
	*/
	export interface IDatepickerOptions
	{
		/**
		* JS function or function name to turn specified HTML element to datepicker
		*             Signature: (element:HTMLElement, isNullableDate: boolean) =&gt; void
		*/
		CreateDatePicker: (element:HTMLElement, isNullableDate: boolean) => void;
		/**
		* JS function to provide datepicker with date from inside tables
		*             Signature: (element:HTMLElement, date?:Date) =&gt; void
		*/
		PutToDatePicker: (element:HTMLElement, date?:Date) => void;
		/**
		* JS function used to retrieve selected date from datepicker
		*             Signature: (element:HTMLElement) =&gt; Date
		*/
		GetFromDatePicker: (element:HTMLElement) => Date;
		/**
		* JS function used to retrieve selected date from datepicker
		*             Signature: (element:HTMLElement) =&gt; Date
		*/
		DestroyDatepicker: (element:HTMLElement) => void;
	}
	/** Set of IDs of core templates */
	export interface ICoreTemplateIds
	{
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
	}
	/** JSON model for table message */
	export interface ITableMessage
	{
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
	export interface IPowerTablesResponse
	{
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
		AdditionalData: { [key:string]: any };
		/** Query succeeded: true/false */
		Success: boolean;
	}
	/** Data request constructed in Javascript, passed to server and extracted from ControllerContext */
	export interface IPowerTableRequest
	{
		/** Command (default is "query") */
		Command: string;
		/** Data query itself */
		Query: PowerTables.IQuery;
	}
	/** Data query (part of request) */
	export interface IQuery
	{
		/** Paging information */
		Paging: PowerTables.IPaging;
		/** Ordering information. Key = column name, Ordering = ordering */
		Orderings: { [key:string]: PowerTables.Ordering };
		/** Filtering arguments. Key = column name, Value = filter argument */
		Filterings: { [key:string]: string };
		/** Additional data. Random KV object */
		AdditionalData: { [key:string]: string };
		/** Static data extractable via PowerTablesHandler */
		StaticDataJson: string;
		/** Raw selection data (primary key to selected columns array) */
		Selection: { [key:string]: number[] };
	}
	/** Paging information */
	export interface IPaging
	{
		/** Required page index */
		PageIndex: number;
		/** Required page size */
		PageSize: number;
	}
	export interface ITableAdjustment
	{
		/** Table message associated with this response */
		Message: PowerTables.ITableMessage;
		/** Special mark to disctinguish Edition result from others on client side */
		IsUpdateResult: boolean;
		UpdatedData: any[];
		RemoveKeys: string[];
		OtherTableAdjustments: { [key:string]: PowerTables.ITableAdjustment };
		/**
		* Additional data being serialized for client. 
		*             This field could contain anything that will be parsed on client side and corresponding actions will be performed. 
		*             See <see cref="T:PowerTables.ResponseProcessing.IResponseModifier" />
		*/
		AdditionalData: { [key:string]: any };
	}
	/** Message type enum */
	export enum MessageType { 
		/**
		* UserMessage is shown using specified custom functions for 
		*             messages showing
		*/
		UserMessage = 0, 
		/** Banner message is displayed among whole table instead of data */
		Banner = 1, 
	}
	/** Ordering */
	export enum Ordering { 
		/** Ascending */
		Ascending = 0, 
		/** Descending */
		Descending = 1, 
		/** Ordering is not applied */
		Neutral = 2, 
	}
}
module PowerTables.Plugins.Formwatch {
	export interface IFormwatchClientConfiguration
	{
		DoNotEmbed: boolean;
		FieldsConfiguration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
		FiltersMappings: { [key:string]: PowerTables.Plugins.Formwatch.IFormWatchFilteringsMappings };
	}
	export interface IFormwatchFieldData
	{
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
	export interface IFormWatchFilteringsMappings
	{
		/** 0 = value filter, 1 = range filter, 2 = multiple filter */
		FilterType: number;
		FieldKeys: string[];
		ForServer: boolean;
		ForClient: boolean;
	}
}
module PowerTables.Plugins.Hideout {
	/** Client hideout plugin configuration */
	export interface IHideoutPluginConfiguration
	{
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
		HiddenColumns: { [key:string]: boolean };
		DefaultTemplateId: string;
	}
}
module PowerTables.Filters.Range {
	/** UI configuration for range filterr */
	export interface IRangeFilterUiConfig
	{
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
		ClientFilteringFunction: (object: any, fromValue:string, toValue:string, query: IQuery)=>boolean;
		/** Gets or sets ability of range filter to convert dates ranges to 1 day automatically when single day is selected */
		TreatEqualDateAsWholeDay: boolean;
		Hidden: boolean;
		DefaultTemplateId: string;
	}
}
module PowerTables.Filters.Value {
	/** UI configuration for value filter */
	export interface IValueFilterUiConfig
	{
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
		ClientFilteringFunction: (object: any, filterValue:string, query: IQuery)=>boolean;
		/** When true, filter UI is not being rendered but client query modifier persists */
		Hidden: boolean;
		/** When true, client value filter will ignore time in case of dates filtering */
		CompareOnlyDates: boolean;
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.ResponseInfo {
	export interface IResponseInfoClientConfiguration
	{
		/**
		* Functions for calculating client-side values
		*             Key = additional field name, Value = function (set) =&gt; any to calculate
		*/
		ClientCalculators: { [key:string] : (data:IClientDataResults) => any };
		/** Client function for template rendering */
		ClientTemplateFunction: (data:any) => string;
		/** Used to point that response info resulting object has been changed */
		ResponseObjectOverriden: boolean;
		DefaultTemplateId: string;
	}
}
module System.Web.Mvc {
	export interface ISelectListItem
	{
		Disabled: boolean;
		Selected: boolean;
		Text: string;
		Value: string;
	}
}
module PowerTables.Filters.Select {
	/** UI configuration for select filter */
	export interface ISelectFilterUiConfig
	{
		/** Preselected filter value */
		SelectedValue: string;
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
		ClientFilteringFunction: (object: any, selectedValues:string[], query: IQuery)=>boolean;
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Limit {
	/**
	* Client configuration for Limit plugin. 
	*             See <see cref="T:PowerTables.Plugins.Limit.LimitPluginExtensions" />
	*/
	export interface ILimitClientConfiguration
	{
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
module PowerTables.Plugins.Ordering {
	/**
	* Client per-column configuration for ordering. 
	*             See <see cref="T:PowerTables.Plugins.Ordering.OrderingExtensions" />
	*/
	export interface IOrderingConfiguration
	{
		/** Default orderings for columns. Key - column RawName, Value - ordering direction */
		DefaultOrderingsForColumns: { [key:string]: PowerTables.Ordering };
		/** Columns that are sortable on client-side with corresponding comparer functions */
		ClientSortableColumns: {[key:string]:(a:any,b:any) => number};
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Paging {
	/**
	* Client configuration for Paging plugin. 
	*             See <see cref="T:PowerTables.Plugins.Paging.PagingExtensions" />
	*/
	export interface IPagingClientConfiguration
	{
		ArrowsMode: boolean;
		UsePeriods: boolean;
		PagesToHideUnderPeriod: number;
		UseFirstLastPage: boolean;
		UseGotoPage: boolean;
		EnableClientPaging: boolean;
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Toolbar {
	export interface IToolbarButtonsClientConfiguration
	{
		Buttons: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
		DefaultTemplateId: string;
	}
	/** JSON configuration for toolbar button */
	export interface IToolbarButtonClientConfiguration
	{
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
		CommandCallbackFunction: (table:any /*PowerTables.PowerTable*/,response:IPowerTablesResponse)=>void;
		/** Gets or sets JS function to be executed before command execution with ability to confinue or reject action. JS function is of type: (continuation: ( queryModifier?:(a:IQuery) =&gt; IQuery ) =&gt; void ) =&gt; void */
		ConfirmationFunction: (continuation:(queryModifier?:(a:IQuery)=>void)=>void)=>void;
		/** Gets or sets JS function to be executed on button click. JS function is of type: (table:any (PowerTables.PowerTable), menuElement:any)=&gt;void */
		OnClick: (table:any /*PowerTables.PowerTable*/,menuElement:any)=>void;
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
module PowerTables.Plugins.Total {
	/** Additional data that will be used to calculate totals */
	export interface ITotalResponse
	{
		/** Totals for particular columns */
		TotalsForColumns: { [key:string]: any };
	}
	/** Client configuration for totals */
	export interface ITotalClientConfiguration
	{
		/** Show totals on the top of the displayed lines or not */
		ShowOnTop: boolean;
		/** Functions for formatting of received values */
		ColumnsValueFunctions: { [key:string] : (a:any)=>string };
		/** Functions for calculating totals */
		ColumnsCalculatorFunctions: { [key:string] : (data:IClientDataResults) => any };
	}
}
module PowerTables.Editing {
	export interface IEditFieldUiConfigBase
	{
		TemplateId: string;
		FieldName: string;
		PluginId: string;
		ValidationMessagesTemplateId: string;
		FakeColumn: PowerTables.Configuration.Json.IColumnConfiguration;
		ValidationMessagesOverride: { [key:string]: string };
	}
	export interface IEditFormUiConfigBase
	{
		Fields: PowerTables.Editing.IEditFieldUiConfigBase[];
	}
}
module PowerTables.Editing.Cells {
	export interface ICellsEditUiConfig extends PowerTables.Editing.IEditFormUiConfigBase
	{
		BeginEditEventId: string;
	}
}
module PowerTables.Editing.Form {
	export interface IFormEditUiConfig extends PowerTables.Editing.IEditFormUiConfigBase
	{
		FormTargetSelector: string;
		FormTemplateId: string;
	}
}
module PowerTables.Editing.Rows {
	export interface IRowsEditUiConfig extends PowerTables.Editing.IEditFormUiConfigBase
	{
		BeginEditEventId: string;
		CommitEventId: string;
		RejectEventId: string;
	}
}
module PowerTables.Editing.Editors.Display {
	export interface IDisplayingEditorUiConfig extends PowerTables.Editing.IEditFieldUiConfigBase
	{
		PluginId: string;
		Template: (cell:ICell) => string;
	}
}
module PowerTables.Editing.Editors.SelectList {
	export interface ISelectListEditorUiConfig extends PowerTables.Editing.IEditFieldUiConfigBase
	{
		PluginId: string;
		SelectListItems: System.Web.Mvc.ISelectListItem[];
		AllowEmptyString: boolean;
		EmptyElementText: string;
		AddEmptyElement: boolean;
		MissingKeyFunction: (a:any)=>any;
		MissingValueFunction: (a:any)=>any;
	}
}
module PowerTables.Editing.Editors.Memo {
	export interface IMemoEditorUiConfig extends PowerTables.Editing.IEditFieldUiConfigBase
	{
		PluginId: string;
		WarningChars: number;
		MaxChars: number;
		Rows: number;
		Columns: number;
		AllowEmptyString: boolean;
	}
}
module PowerTables.Editing.Editors.Check {
	export interface ICheckEditorUiConfig extends PowerTables.Editing.IEditFieldUiConfigBase
	{
		PluginId: string;
		IsMandatory: boolean;
	}
}
module PowerTables.Editing.Editors.PlainText {
	export interface IPlainTextEditorUiConfig extends PowerTables.Editing.IEditFieldUiConfigBase
	{
		PluginId: string;
		ValidationRegex: string;
		EnableBasicValidation: boolean;
		FormatFunction: (value:any,column:IColumn) => string;
		ParseFunction: (value:string,column:IColumn,errors:PowerTables.Editing.IValidationMessage[]) => any;
		FloatRemoveSeparatorsRegex: string;
		FloatDotReplaceSeparatorsRegex: string;
		AllowEmptyString: boolean;
		MaxAllowedLength: number;
	}
}
module PowerTables.Plugins.LoadingOverlap {
	export interface ILoadingOverlapUiConfig
	{
		Overlaps: { [key:string]: string };
		DefaultTemplateId: string;
	}
	export enum OverlapMode { 
		All = 0, 
		BodyOnly = 1, 
		Parent = 2, 
	}
}
module PowerTables.Plugins.Reload {
	/** Client configuration for Reload plugin */
	export interface IReloadUiConfiguration
	{
		/** Should table be reloaded forcibly */
		ForceReload: boolean;
		/** Selector where to render reload button */
		RenderTo: string;
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Hierarchy {
	/** Client-side configuration of hierarchy plugin */
	export interface IHierarchyUiConfiguration
	{
		/** Gets or sets expansion behavior. Options are - to load collapsed nodes contents from server-side everywhere or try to fetch from local cache */
		ExpandBehavior: PowerTables.Plugins.Hierarchy.NodeExpandBehavior;
		/** Gets or sets tree filtering behavior. Setting this option to ExcludeCollapsed will disallow searching inside collapsed nodes */
		CollapsedNodeFilterBehavior: PowerTables.Plugins.Hierarchy.TreeCollapsedNodeFilterBehavior;
	}
	/** Controls policy of nodes collapsing and expanding */
	export enum NodeExpandBehavior { 
		/** This option will not fetch subtree nodes when locally loaded data available */
		LoadFromCacheWhenPossible = 0, 
		/**
		* This option will make hierarchy plugin always fetch subtree from 
		*             server-side even if local data available
		*/
		AlwaysLoadRemotely = 1, 
	}
	/** This option controls client filtering policy related to collapsed nodes */
	export enum TreeCollapsedNodeFilterBehavior { 
		/** In this case, even collapsed nodes will be included to filter results */
		IncludeCollapsed = 0, 
		/** In this case, even collapsed nodes will be excluded from filter results */
		ExcludeCollapsed = 1, 
	}
}
module PowerTables.Plugins.MouseSelect {
	export interface IMouseSelectUiConfig
	{
	}
}
