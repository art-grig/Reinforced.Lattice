//     This code was generated by a Reinforced.Typings tool. 
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.


module PowerTables {
	export interface ICheckboxifyPlugin
	{
		getSelection() : string[];
		selectAll(select: boolean) : void;
		resetSelection() : void;
		selectItem(itemId: string, selected: boolean) : void;
	}
	export interface IDatepickerOptions
	{
		CreateDatePicker: (element:HTMLElement, isNullableDate: boolean) => void;
		PutToDatePicker: (element:HTMLElement, date?:Date) => void;
		GetFromDatePicker: (element:HTMLElement) => Date;
	}
	export interface IPowerTablesResponse
	{
		IsLatticeResponse: boolean;
		ResultsCount: number;
		PageIndex: number;
		Data: any[];
		AdditionalData: { [key:string]: any };
		Success: boolean;
		Message: string;
		ExceptionStackTrace: string;
	}
	export interface IPowerTableRequest
	{
		Command: string;
		Query: PowerTables.IQuery;
	}
	export interface IQuery
	{
		Paging: PowerTables.IPaging;
		Orderings: { [key:string]: PowerTables.Ordering };
		Filterings: { [key:string]: string };
		AdditionalData: { [key:string]: string };
		StaticDataJson: string;
	}
	export interface IPaging
	{
		PageIndex: number;
		PageSize: number;
	}
	export enum Ordering { 
		Ascending = 0, 
		Descending = 1, 
		Neutral = 2, 
	}
}
module PowerTables.Configuration.Json {
	export interface ITableConfiguration
	{
		EmptyFiltersPlaceholder: string;
		Prefix: string;
		TableRootId: string;
		OperationalAjaxUrl: string;
		LoadImmediately: boolean;
		DatepickerOptions: PowerTables.IDatepickerOptions;
		Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
		PluginsConfiguration: PowerTables.Configuration.Json.IPluginConfiguration[];
		StaticData: string;
	}
	export interface IColumnConfiguration
	{
		Title: string;
		RawColumnName: string;
		CellRenderingTemplateId: string;
		CellRenderingValueFunction: (a:any) => string;
		ColumnType: string;
		IsDataOnly: boolean;
		IsEnum: boolean;
		IsNullable: boolean;
	}
	export interface IPluginConfiguration
	{
		PluginId: string;
		Placement: string;
		Configuration: any;
		Order: number;
	}
}
module PowerTables.Plugins.Checkboxify {
	export interface ICheckboxifyClientConfig
	{
		SelectionColumnName: string;
		ResetOnReload: boolean;
		EnableSelectAll: boolean;
		SelectAllSelectsServerUndisplayedData: boolean;
		SelectAllSelectsClientUndisplayedData: boolean;
		SelectAllOnlyIfAllData: boolean;
		ResetOnClientReload: boolean;
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
	}
	export interface IFormWatchFilteringsMappings
	{
		FilterType: number;
		FieldKeys: string[];
		ForServer: boolean;
		ForClient: boolean;
	}
}
module PowerTables.Plugins.Hideout {
	export interface IHideoutPluginConfiguration
	{
		ShowMenu: boolean;
		HideableColumnsNames: string[];
		ColumnInitiatingReload: string[];
		HiddenColumns: { [key:string]: boolean };
	}
}
module PowerTables.Filters.Range {
	export interface IRangeFilterUiConfig
	{
		ColumnName: string;
		FromPlaceholder: string;
		ToPlaceholder: string;
		InputDelay: number;
		FromValue: string;
		ToValue: string;
		ClientFiltering: boolean;
		ClientFilteringFunction: (object: any, fromValue:string, toValue:string, query: IQuery)=>boolean;
		Hidden: boolean;
	}
}
module PowerTables.Filters.Value {
	export interface IValueFilterUiConfig
	{
		Placeholder: string;
		InputDelay: number;
		DefaultValue: string;
		ColumnName: string;
		ClientFiltering: boolean;
		ClientFilteringFunction: (object: any, filterValue:string, query: IQuery)=>boolean;
		Hidden: boolean;
	}
}
module PowerTables.Plugins.ResponseInfo {
	export interface IResponseInfoClientConfiguration
	{
		TemplateText: string;
		ClientEvaluationFunction: (data:IClientDataResults, currentPage:number, totalPages:number) => any;
		ClientTemplateFunction: (data:any) => string;
		ResponseObjectOverriden: boolean;
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
	export interface ISelectFilterUiConfig
	{
		SelectedValue: string;
		AllowSelectNothing: boolean;
		IsMultiple: boolean;
		NothingText: string;
		ColumnName: string;
		Items: System.Web.Mvc.ISelectListItem[];
		Hidden: boolean;
		ClientFiltering: boolean;
		ClientFilteringFunction: (object: any, selectedValues:string[], query: IQuery)=>boolean;
	}
}
module PowerTables.Plugins.Limit {
	export interface ILimitClientConfiguration
	{
		DefaultValue: string;
		LimitValues: number[];
		LimitLabels: string[];
		ReloadTableOnLimitChange: boolean;
		EnableClientLimiting: boolean;
	}
}
module PowerTables.Plugins.Ordering {
	export interface IOrderingConfiguration
	{
		DefaultOrderingsForColumns: { [key:string]: PowerTables.Ordering };
		ClientSortableColumns: {[key:string]:(a:any,b:any) => number};
	}
}
module PowerTables.Plugins.Paging {
	export interface IPagingClientConfiguration
	{
		ArrowsMode: boolean;
		UsePeriods: boolean;
		PagesToHideUnderPeriod: number;
		UseFirstLastPage: boolean;
		UseGotoPage: boolean;
		EnableClientPaging: boolean;
	}
}
module PowerTables.Plugins.Toolbar {
	export interface IToolbarButtonsClientConfiguration
	{
		Buttons: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
	}
	export interface IToolbarButtonClientConfiguration
	{
		Id: string;
		Css: string;
		Style: string;
		HtmlContent: string;
		Command: string;
		BlackoutWhileCommand: boolean;
		DisableIfNothingChecked: boolean;
		Title: string;
		CommandCallbackFunction: (table:any /*PowerTables.PowerTable*/,response:IPowerTablesResponse)=>void;
		ConfirmationFunction: (continuation:(queryModifier?:(a:IQuery)=>void)=>void)=>void;
		OnClick: (table:any /*PowerTables.PowerTable*/,menuElement:any)=>void;
		Submenu: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
		HasSubmenu: boolean;
		IsMenu: boolean;
		Separator: boolean;
		InternalId: number;
		IsDisabled: boolean;
	}
}
module PowerTables.Plugins.Total {
	export interface ITotalResponse
	{
		TotalsForColumns: { [key:string]: string };
	}
	export interface ITotalClientConfiguration
	{
		ShowOnTop: boolean;
		ColumnsValueFunctions: { [key:string] : (a:any)=>string };
		ColumnsCalculatorFunctions: { [key:string] : (data:IClientDataResults) => any };
	}
}
module PowerTables.Editors {
	export interface ICellEditorUiConfigBase
	{
		PluginId: string;
		CustomValidationFunction: (currentValue: any, originalDataObject: any, modifiedDataObject:any) => string[];
	}
	export interface IEditorUiConfig
	{
		BeginEditEventId: string;
		CommitEventId: string;
		RejectEventId: string;
		EditorsForColumns: { [key:string]: PowerTables.Editors.ICellEditorUiConfigBase };
		RefreshMode: PowerTables.Editors.EditorRefreshMode;
		IsServerPowered: boolean;
	}
	export enum EditorRefreshMode { 
		RedrawCell = 0, 
		RedrawRow = 1, 
		RedrawAllVisible = 2, 
		ReloadFromServer = 3, 
	}
}
module PowerTables.Editors.PlainText {
	export interface IPlainTextEditorUiConfig extends PowerTables.Editors.ICellEditorUiConfigBase
	{
		PluginId: string;
		ValidationRegex: string;
		RegexValidationErrorText: string;
		EnableBasicValidation: boolean;
		BasicValidationErrorMessage: string;
		FormatFunction: (value:any,column:IColumn) => string;
		ParseFunction: (value:string,column:IColumn,errors:string[]) => any;
		FloatRemoveSeparatorsRegex: string;
		FloatDotReplaceSeparatorsRegex: string;
	}
}
