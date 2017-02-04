//     This code was generated by a Reinforced.Typings tool. 
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.


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
		CoreTemplates: PowerTables.ICoreTemplateIds;
		KeyFields: string[];
		CallbackFunction: (table:IMasterTable) => void;
		TemplateSelector: (row:IRow)=>string;
		MessageFunction: (msg: ITableMessage) => void;
		Subscriptions: PowerTables.Configuration.Json.IConfiguredSubscriptionInfo[];
		QueryConfirmation: (query:IPowerTableRequest,scope:QueryScope,continueFn:any) => void;
		SelectionConfiguration: PowerTables.Configuration.Json.ISelectionConfiguration;
		PrefetchedData: any[];
		Commands: { [key:string]: PowerTables.Commands.ICommandDescription };
		Partition: PowerTables.Configuration.Json.IPartitionConfiguration;
	}
	export interface IColumnConfiguration
	{
		Title: string;
		DisplayOrder: number;
		Description: string;
		Meta?: any;
		RawColumnName: string;
		CellRenderingTemplateId: string;
		CellRenderingValueFunction: (a:any) => string;
		ColumnType: string;
		IsDataOnly: boolean;
		IsEnum: boolean;
		IsNullable: boolean;
		ClientValueFunction: (a:any) => any;
		TemplateSelector: (cell:ICell)=>string;
		IsSpecial: boolean;
	}
	export interface IPluginConfiguration
	{
		PluginId: string;
		Placement: string;
		Configuration: any;
		Order: number;
		TemplateId: string;
	}
	export interface IConfiguredSubscriptionInfo
	{
		IsRowSubscription: boolean;
		ColumnName: string;
		Selector: string;
		DomEvent: string;
		Handler: (dataObject:any, originalEvent:any) => void;
	}
	export interface ISelectionConfiguration
	{
		SelectAllBehavior: PowerTables.Configuration.Json.SelectAllBehavior;
		ResetSelectionBehavior: PowerTables.Configuration.Json.ResetSelectionBehavior;
		CanSelectRowFunction: (dataObject:any)=>boolean;
		CanSelectCellFunction: (dataObject:any,column:string,select:boolean)=>boolean;
		NonselectableColumns: string[];
		SelectSingle: boolean;
		InitialSelected: { [key:string]: string[] };
	}
	export interface IPartitionConfiguration
	{
		Type: PowerTables.Configuration.Json.PartitionType;
		Mixed: PowerTables.Configuration.Json.IMixedPartitionConfiguration;
		InitialSkip: number;
		InitialTake: number;
	}
	export interface IMixedPartitionConfiguration
	{
		LoadAhead: number;
		Rebuy: boolean;
		NoCount: boolean;
	}
	export enum SelectAllBehavior { 
		AllVisible = 0, 
		OnlyIfAllDataVisible = 1, 
		AllLoadedData = 2, 
		Disabled = 3, 
	}
	export enum ResetSelectionBehavior { 
		DontReset = 0, 
		ServerReload = 1, 
		ClientReload = 2, 
	}
	export enum PartitionType { 
		Client = 0, 
		Server = 1, 
		Mixed = 2, 
	}
}
module PowerTables {
	export interface IDatepickerOptions
	{
		CreateDatePicker: (element:HTMLElement, isNullableDate: boolean) => void;
		PutToDatePicker: (element:HTMLElement, date?:Date) => void;
		GetFromDatePicker: (element:HTMLElement) => Date;
		DestroyDatepicker: (element:HTMLElement) => void;
	}
	export interface ICoreTemplateIds
	{
		Layout: string;
		PluginWrapper: string;
		RowWrapper: string;
		CellWrapper: string;
		HeaderWrapper: string;
	}
	export interface ITableMessage
	{
		Type: PowerTables.MessageType;
		Title: string;
		Details: string;
		Class: string;
	}
	export interface IPowerTablesResponse
	{
		Message: PowerTables.ITableMessage;
		ResultsCount: number;
		PageIndex: number;
		Data: any[];
		AdditionalData: any;
		Success: boolean;
	}
	export interface IPowerTableRequest
	{
		Command: string;
		Query: PowerTables.IQuery;
	}
	export interface IQuery
	{
		Partition?: PowerTables.IPartition;
		Orderings: { [key:string]: PowerTables.Ordering };
		Filterings: { [key:string]: string };
		AdditionalData: { [key:string]: string };
		StaticDataJson: string;
		Selection: { [key:string]: number[] };
	}
	export interface IPartition
	{
		Skip: number;
		Take: number;
		NoCount: boolean;
	}
	export interface ITableAdjustment
	{
		Message: PowerTables.ITableMessage;
		IsUpdateResult: boolean;
		UpdatedData: any[];
		RemoveKeys: string[];
		OtherTablesAdjustments: { [key:string]: PowerTables.ITableAdjustment };
		AdditionalData: any;
	}
	export enum MessageType { 
		UserMessage = 0, 
		Banner = 1, 
	}
	export enum Ordering { 
		Ascending = 0, 
		Descending = 1, 
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
		IsBoolean: boolean;
		IsString: boolean;
		IsInteger: boolean;
		IsFloating: boolean;
		ArrayDelimiter: string;
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
		DefaultTemplateId: string;
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
		TreatEqualDateAsWholeDay: boolean;
		Hidden: boolean;
		DefaultTemplateId: string;
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
		CompareOnlyDates: boolean;
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.ResponseInfo {
	export interface IResponseInfoClientConfiguration
	{
		ClientCalculators: { [key:string] : (data:IClientDataResults) => any };
		ClientTemplateFunction: (data:any) => string;
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
	export interface ISelectFilterUiConfig
	{
		SelectedValue: string;
		IsMultiple: boolean;
		ColumnName: string;
		Items: System.Web.Mvc.ISelectListItem[];
		Hidden: boolean;
		ClientFiltering: boolean;
		ClientFilteringFunction: (object: any, selectedValues:string[], query: IQuery)=>boolean;
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Limit {
	export interface ILimitClientConfiguration
	{
		DefaultValue: string;
		LimitValues: number[];
		LimitLabels: string[];
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Ordering {
	export interface IOrderingConfiguration
	{
		DefaultOrderingsForColumns: { [key:string]: PowerTables.Ordering };
		ClientSortableColumns: {[key:string]:(a:any,b:any) => number};
		DefaultTemplateId: string;
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
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Toolbar {
	export interface IToolbarButtonsClientConfiguration
	{
		Buttons: PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration[];
		DefaultTemplateId: string;
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
		TotalsForColumns: { [key:string]: any };
	}
	export interface ITotalClientConfiguration
	{
		ShowOnTop: boolean;
		ColumnsValueFunctions: { [key:string] : (a:any)=>string };
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
	export interface IReloadUiConfiguration
	{
		ForceReload: boolean;
		RenderTo: string;
		DefaultTemplateId: string;
	}
}
module PowerTables.Plugins.Hierarchy {
	export interface IHierarchyUiConfiguration
	{
		ExpandBehavior: PowerTables.Plugins.Hierarchy.NodeExpandBehavior;
		CollapsedNodeFilterBehavior: PowerTables.Plugins.Hierarchy.TreeCollapsedNodeFilterBehavior;
	}
	export enum NodeExpandBehavior { 
		LoadFromCacheWhenPossible = 0, 
		AlwaysLoadRemotely = 1, 
	}
	export enum TreeCollapsedNodeFilterBehavior { 
		IncludeCollapsed = 0, 
		ExcludeCollapsed = 1, 
	}
}
module PowerTables.Plugins.MouseSelect {
	export interface IMouseSelectUiConfig
	{
	}
}
module PowerTables.Plugins.Checkboxify {
	export interface ICheckboxifyUiConfig
	{
		SelectAllTemplateId: string;
	}
}
module PowerTables.Adjustments {
	export interface ISelectionAdditionalData
	{
		SelectionToggle: PowerTables.Adjustments.SelectionToggle;
		Unselect: { [key:string]: string[] };
		Select: { [key:string]: string[] };
	}
	export enum SelectionToggle { 
		LeaveAsIs = 0, 
		All = 1, 
		Nothing = 2, 
	}
}
module PowerTables.Plugins.RegularSelect {
	export interface IRegularSelectUiConfig
	{
		Mode: PowerTables.Plugins.RegularSelect.RegularSelectMode;
	}
	export enum RegularSelectMode { 
		Rows = 0, 
		Cells = 1, 
	}
}
module PowerTables.Commands {
	export interface ICommandDescription
	{
		Name: string;
		ServerName: string;
		ClientFunction: (param:ICommandExecutionParameters)=>any;
		ConfirmationDataFunction: (param:ICommandExecutionParameters)=>any;
		CanExecute: (data:{Subject:any,Master:IMasterTable})=>boolean;
		Type: PowerTables.Commands.CommandType;
		Confirmation: PowerTables.Commands.IConfirmationConfiguration;
		OnSuccess: (param:ICommandExecutionParameters)=>void;
		OnFailure: (param:ICommandExecutionParameters)=>void;
		OnBeforeExecute: (param:ICommandExecutionParameters)=>any;
	}
	export interface IConfirmationConfiguration
	{
		TemplateId: string;
		TemplatePieces: {[_:string]:(param:ICommandExecutionParameters)=>string};
		TargetSelector: string;
		Formwatch: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
		Autoform: PowerTables.Commands.ICommandAutoformConfiguration;
		Details: PowerTables.Commands.IDetailLoadingConfiguration;
		ContentLoadingUrl: (subject:any)=>string;
		ContentLoadingMethod: string;
		ContentLoadingCommand: string;
		InitConfirmationObject: (confirmationObject:any,param:ICommandExecutionParameters)=>void;
		OnDismiss: (param:ICommandExecutionParameters)=>void;
		OnCommit: (param:ICommandExecutionParameters)=>void;
		OnContentLoaded: (param:ICommandExecutionParameters)=>void;
		OnDetailsLoaded: (param:ICommandExecutionParameters)=>void;
	}
	export interface ICommandAutoformConfiguration
	{
		Autoform: PowerTables.Editing.IEditFieldUiConfigBase[];
		DisableWhenContentLoading: boolean;
		DisableWhileDetailsLoading: boolean;
	}
	export interface IDetailLoadingConfiguration
	{
		CommandName: string;
		TempalteId: string;
		LoadImmediately: boolean;
		ValidateToLoad: (param:ICommandExecutionParameters)=>boolean;
		DetailsFunction: (param:ICommandExecutionParameters)=>any;
		LoadDelay: number;
		LoadOnce: boolean;
	}
	export enum CommandType { 
		Client = 0, 
		Server = 1, 
	}
}
module PowerTables.Plugins.Scrollbar {
	export interface IScrollbarPluginUiConfig
	{
		WheelEventsCatcher: string;
		KeyboardEventsCatcher: string;
		IsHorizontal: boolean;
		StickToElementSelector: string;
		StickDirection: PowerTables.Plugins.Scrollbar.StickDirection;
		StickHollow: PowerTables.Plugins.Scrollbar.StickHollow;
		DefaultTemplateId: string;
		Keys: PowerTables.Plugins.Scrollbar.IScrollbarKeyMappings;
		Forces: PowerTables.Plugins.Scrollbar.IScrollbarForces;
		PositionCorrector: any;
		UseTakeAsPageForce: boolean;
		ScrollerMinSize: number;
		ArrowsDelayMs: number;
	}
	export interface IScrollbarKeyMappings
	{
		SingleUp: number[];
		SingleDown: number[];
		PageUp: number[];
		PageDown: number[];
		Home: number[];
		End: number[];
	}
	export interface IScrollbarForces
	{
		WheelForce: number;
		SingleForce: number;
		PageForce: number;
	}
	export enum StickDirection { 
		Right = 0, 
		Left = 1, 
		Top = 2, 
		Bottom = 3, 
	}
	export enum StickHollow { 
		Internal = 0, 
		External = 1, 
	}
}
