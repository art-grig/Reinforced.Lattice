/// <reference path="typings/jquery/jquery.d.ts" />
declare module PowerTables {
    /** Cell object */
    interface ICell {
        /** Associated row */
        Row: PowerTables.IRow;
        /** Associated column */
        Column: PowerTables.IColumn;
        /** Data for this specific cell */
        Data: any;
        /** Whole data object associated with this specific cell */
        DataObject: any;
        /** Cell element */
        Element: any;
        /** Denotes fake cell without data */
        Fake: boolean;
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
        RawName: string;
        Configuration: PowerTables.Configuration.Json.IColumnConfiguration;
        MasterTable: PowerTables.IPowerTable;
        Filter: PowerTables.IFilter;
        Elements: any;
        HeaderElement: any;
        Fake: boolean;
    }
    interface IQueryPartProvider {
        modifyQuery(query: PowerTables.IQuery): void;
    }
    interface IRenderableComponent {
        Element: any;
        render(context?: any): string;
        subscribeEvents(parentElement: JQuery): void;
        setTemplateId(templateId?: string): void;
        renderTo(parentElement: JQuery, context?: any): any;
    }
    interface IFilter extends PowerTables.IQueryPartProvider, PowerTables.IRenderableComponent {
        reset(): void;
    }
    interface IPlugin extends PowerTables.IRenderableComponent {
        IsToolbarPlugin: boolean;
        IsQueryModifier: boolean;
        IsRenderable: boolean;
        PluginId: string;
        init(table: PowerTables.IPowerTable, pluginConfiguration: PowerTables.Configuration.Json.IPluginConfiguration): void;
    }
    interface IPowerTable {
        Columns: {
            [key: string]: PowerTables.IColumn;
        };
        Filters: {
            [key: string]: PowerTables.IFilter;
        };
        Configuration: PowerTables.Configuration.Json.ITableConfiguration;
        getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin;
        reload(): void;
        requestServer(command: string, callback: (arg: any) => void, queryModifier?: (arg: PowerTables.IQuery) => PowerTables.IQuery): void;
        isDateTime(columnName: string): boolean;
        getColumnNames(): string[];
        registerQueryPartProvider(provider: PowerTables.IQueryPartProvider): void;
    }
    interface IRow {
        DataObject: any;
        Index: number;
        MasterTable: PowerTables.IPowerTable;
        Elements: any;
        Element: any;
        Fake: boolean;
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
    interface ITableConfiguration {
        TableRootId: string;
        OperationalAjaxUrl: string;
        DefaultCellElement: string;
        DefaultRowElement: string;
        LoadImmediately: boolean;
        ServerDateTimeFormat: string;
        ClientDateTimeFormat: string;
        DatePickerFunction: (e: any, format: string) => void;
        Columns: PowerTables.Configuration.Json.IColumnConfiguration[];
        PluginsConfiguration: {
            [key: string]: PowerTables.Configuration.Json.IPluginConfiguration;
        };
        /** Not cloneable! */
        StaticData: string;
        RawColumnNames: string[];
    }
    interface IColumnConfiguration {
        Title: string;
        RawColumnName: string;
        Filter: PowerTables.Configuration.Json.IColumnFilterConfiguration;
        CellRenderingTemplateId: string;
        CellRenderingHtmlFunction: (a: any) => string;
        CellRenderingValueFunction: (a: any) => string;
        CellPluginsConfiguration: {
            [key: string]: any;
        };
        ColumnType: string;
        IsDataOnly: boolean;
    }
    interface IColumnFilterConfiguration {
        FilterKey: string;
        FilterConfiguration: any;
    }
    interface IPluginConfiguration {
        PluginId: string;
        Placement: string;
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
    interface IHideoutCellConfiguration {
        Hidden: boolean;
    }
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
    interface IRangeFilterClientConfig {
        FromPlaceholder: string;
        ToPlaceholder: string;
        InputDelay: number;
        FromValue: string;
        ToValue: string;
    }
}
declare module PowerTables.Filters.Value {
    interface IValueFilterClientConfig {
        Placeholder: string;
        InputDelay: number;
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
    /**
    * Client configuration for select filter.
    *             See <see cref="T:PowerTables.Filters.Select.SelectFilterExtensions" />
    */
    interface ISelectFilterClientConfig {
        SelectedValue: string;
        AllowSelectNothing: boolean;
        IsMultiple: boolean;
        NothingText: string;
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
    interface IOrderableConfiguration {
        DefaultOrdering: PowerTables.Ordering;
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
    class ComponentsContainer {
        private static _components;
        static registerComponent(key: string, ctor: Function): void;
        static resolveComponent<T>(key: string, args?: any[]): T;
    }
}
declare module PowerTables {
    class RenderableComponent implements IRenderableComponent {
        constructor(templateId?: string);
        Element: JQuery;
        private _templateId;
        private _templateDelegate;
        setTemplateId(templateId?: string): void;
        resetTemplateDelegate(): void;
        renderTo(parentElement: JQuery, context?: any): JQuery;
        getTemplateContent(): string;
        protected DontCacheDelegate: boolean;
        render(context?: any): string;
        subscribeEvents(parentElement: JQuery): void;
    }
}
declare module PowerTables {
    class DataHolder {
        constructor(table: PowerTable);
        CurrentPageIndex: number;
        CurrentTotalResultsCount: number;
        CurrentData: any[];
        private _table;
        Rows: IRow[];
        storeResponse(response: IPowerTablesResponse, data: any[]): void;
        storeRow(row: IRow): void;
    }
}
declare module PowerTables {
    class TableEvent<TFunc> {
        private _handlers;
        invoke(thisArg: any, args?: any[]): void;
        subscribe(handler: TFunc, key: string): void;
        unsubscribe(key: string): void;
    }
    class EventsManager {
        AfterInit: TableEvent<(table: PowerTable) => void>;
        BeforeColumnsRender: TableEvent<(table: PowerTable) => void>;
        AfterColumnsRender: TableEvent<(table: PowerTable) => void>;
        BeforeFiltersRender: TableEvent<(table: PowerTable) => void>;
        BeforeFilterRender: TableEvent<(column: IColumn) => void>;
        AfterFilterRender: TableEvent<(column: IColumn) => void>;
        AfterFiltersRender: TableEvent<(table: PowerTable) => void>;
        BeforeColumnHeaderRender: TableEvent<(column: IColumn) => void>;
        AfterColumnHeaderRender: TableEvent<(column: IColumn) => void>;
        BeforeLoading: TableEvent<(table: PowerTable) => void>;
        DataReceived: TableEvent<(data: any) => void>;
        AfterLoading: TableEvent<(table: PowerTable) => void>;
        BeforeResponseDrawing: TableEvent<(response: IPowerTablesResponse) => void>;
        ResponseDrawing: TableEvent<(response: IPowerTablesResponse) => void>;
        ColumnsOrdering: TableEvent<(table: PowerTable, columnOrder: string[]) => void>;
        BeforeFilterGathering: TableEvent<(query: IQuery) => void>;
        AfterFilterGathering: TableEvent<(query: IQuery) => void>;
        BeforeRowDraw: TableEvent<(table: PowerTable, row: IRow) => void>;
        AfterRowDraw: TableEvent<(table: PowerTable, row: IRow) => void>;
        BeforeCellDraw: TableEvent<(cell: ICell) => void>;
        AfterCellDraw: TableEvent<(cell: ICell) => void>;
        BeforeLayoutDraw: TableEvent<(cell: ICell) => void>;
        AfterLayoutDraw: TableEvent<(cell: ICell) => void>;
        SelectionChanged: TableEvent<(selection: string[]) => void>;
    }
}
declare module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import ColumnConfiguration = PowerTables.Configuration.Json.IColumnConfiguration;
    class Renderer {
        constructor(rootId: string);
        private _rootId;
        ColumnsRenderFunctions: {
            [key: string]: (x: ICell) => JQuery;
        };
        LayoutRoot: JQuery;
        TablePlaceholder: JQuery;
        PluginsLT: JQuery;
        PluginsLB: JQuery;
        PluginsRT: JQuery;
        PluginsRB: JQuery;
        PluginsLT_Toolbar: JQuery;
        PluginsLB_Toolbar: JQuery;
        PluginsRT_Toolbar: JQuery;
        PluginsRB_Toolbar: JQuery;
        Table: JQuery;
        Headers: JQuery;
        Filters: JQuery;
        Body: JQuery;
        private _noData;
        private _columnHeader;
        private _rawColumnHeader;
        private _emptyFilter;
        private _error;
        private _loading;
        private _rawCell;
        private _pluginPlaceholder;
        private _row;
        hideFilters(): void;
        showFilters(): void;
        toggleFilters(): void;
        renderColumnHeader(column: IColumn): JQuery;
        renderRawColumnHeader(rawContent: string): JQuery;
        renderEmptyFilter(): JQuery;
        showError(errorText: string): void;
        showLoading(): void;
        renderRawCell(rawContent: string): JQuery;
        createDatepicker: (element: JQuery) => void;
        renderRow(index: number): JQuery;
        layout(): void;
        getPluginsPlaceholder(placeholder: string): JQuery;
        getToolbarPlaceholder(placeholder: string): JQuery;
        clearTableResults(): void;
        renderNoData(): void;
        appendRow(rowElement: JQuery): void;
        renderPlugin(plugin: IPlugin, configuration: PluginConfiguration): void;
        renderCell(cell: ICell): JQuery;
        cacheCellsRenderFunctions(columns: ColumnConfiguration[], defaultCellElement: string): void;
    }
}
declare module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration;
    import IHandlebars = Handlebars.IHandlebars;
    class PowerTable implements IPowerTable {
        constructor(configuration: TableConfiguration);
        Events: EventsManager;
        Filters: {
            [key: string]: IFilter;
        };
        Columns: {
            [key: string]: IColumn;
        };
        Configuration: TableConfiguration;
        Renderer: Renderer;
        Handlebars: IHandlebars;
        private _queryPartProviders;
        private _data;
        private _plugins;
        private initColumns();
        private initFilters();
        private initPlugins();
        getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin;
        reload(): void;
        private _previousRequest;
        private getXmlHttp();
        requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery): void;
        isDateTime(columnName: string): boolean;
        private parseResponse(response);
        getColumnNames(): string[];
        private drawResponse(response);
        private gatherQuery();
        registerQueryPartProvider(provider: IQueryPartProvider): void;
    }
}
declare module PowerTables {
    class FilterBase<TConfiguration> extends RenderableComponent implements IFilter {
        constructor(templateId: string, column: IColumn);
        Configuration: TConfiguration;
        Column: IColumn;
        protected Table: PowerTable;
        IsDateTime: boolean;
        reset(): void;
        modifyQuery(query: IQuery): void;
        getArgument(): string;
    }
}
declare module PowerTables {
    import SelectFilterClientConfig = PowerTables.Filters.Select.ISelectFilterClientConfig;
    class SelectFilter extends FilterBase<SelectFilterClientConfig> {
        constructor(column: IColumn);
        private _selectElement;
        private _filteringIsBeingExecuted;
        subscribeEvents(parentElement: JQuery): void;
        handleValueChanged(): void;
        getArgument(): string;
        reset(): void;
    }
}
declare module PowerTables {
    import ValueFilterClientConfig = PowerTables.Filters.Value.IValueFilterClientConfig;
    class ValueFilter extends FilterBase<ValueFilterClientConfig> {
        constructor(column: IColumn);
        private _inputElement;
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _previousValue;
        subscribeEvents(parentElement: JQuery): void;
        handleValueChanged(): void;
        getArgument(): string;
        reset(): void;
    }
}
declare module PowerTables {
    import RangeFilterClientConfig = PowerTables.Filters.Range.IRangeFilterClientConfig;
    class RangeFilter extends FilterBase<RangeFilterClientConfig> {
        constructor(column: IColumn);
        private _fromElement;
        private _toElement;
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _fromPreviousValue;
        private _toPreviousValue;
        subscribeEvents(parentElement: JQuery): void;
        handleValueChanged(): void;
        getArgument(): string;
        reset(): void;
    }
}
declare module PowerTables {
    class PluginBase<TConfiguration> extends RenderableComponent implements IPlugin {
        protected Configuration: TConfiguration;
        protected MasterTable: PowerTable;
        constructor(templateId?: string);
        init(table: PowerTable, configuration: PowerTables.Configuration.Json.IPluginConfiguration): void;
        protected subscribe(e: EventsManager): void;
        IsToolbarPlugin: boolean;
        IsQueryModifier: boolean;
        IsRenderable: boolean;
        PluginId: string;
    }
}
declare module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import LimitClientConfiguration = PowerTables.Plugins.Limit.ILimitClientConfiguration;
    class LimitPlugin extends PluginBase<LimitClientConfiguration> implements IQueryPartProvider {
        private _pageSize;
        private _selectedLabelElement;
        constructor();
        init(table: PowerTable, configuration: PluginConfiguration): void;
        private addLimits(query);
        IsToolbarPlugin: boolean;
        PluginId: string;
        Sizes: any[];
        DefaultLabel: string;
        DefaultValue: string;
        private handleLimitSelect(item);
        subscribeEvents(parentElement: JQuery): void;
        IsQueryModifier: boolean;
        IsRenderable: boolean;
        modifyQuery(query: IQuery): void;
    }
}
declare module PowerTables {
    class LoadingPlugin extends PluginBase<any> {
        private _element;
        constructor();
        private showLoading();
        private hideLoading();
        IsToolbarPlugin: boolean;
        PluginId: string;
        IsRenderable: boolean;
        subscribeEvents(parentElement: JQuery): void;
        IsQueryModifier: boolean;
        subscribe(e: EventsManager): void;
    }
}
declare module PowerTables {
    import PagingClientConfiguration = PowerTables.Plugins.Paging.IPagingClientConfiguration;
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
    class PagingPlugin extends PluginBase<PagingClientConfiguration> implements IQueryPartProvider {
        constructor();
        Pages: IPagesElement[];
        Shown: boolean;
        NextArrow: boolean;
        PrevArrow: boolean;
        private _selectedPage;
        private _totalPages;
        private _pageSize;
        private _firstDraw;
        private _pagerContainer;
        private _gotoPage;
        private _gotoPanel;
        private _gotoPageBtn;
        init(table: PowerTable, configuration: PowerTables.Configuration.Json.IPluginConfiguration): void;
        private onFilterGathered(query);
        private onResponse(response);
        modifyQuery(query: IQuery): void;
        private constructPagesElements();
        subscribeEvents(parentElement: JQuery): void;
        private findElements();
        private pageClick(page);
        private nextClick();
        private previousClick();
        private goToPageClick();
        private validateGotopage();
        render(context?: any): string;
        IsToolbarPlugin: boolean;
        IsQueryModifier: boolean;
        PluginId: string;
        IsRenderable: boolean;
    }
}
declare module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    interface IOrderingModel {
        Type: Ordering;
        Title: string;
        IsAscending: () => boolean;
        IsDescending: () => boolean;
        IsNeutral: () => boolean;
    }
    class OrderingPlugin extends PluginBase<any> implements IQueryPartProvider {
        protected RenderingTemplate: HandlebarsTemplateDelegate;
        private _cellsOrderings;
        constructor();
        init(table: PowerTable, configuration: PluginConfiguration): void;
        private onHeaderRender(c);
        protected changeOrdering(c: IColumn): void;
        protected updateCellOrdering(c: IColumn): void;
        private createOrderingModel(sortType, c);
        IsToolbarPlugin: boolean;
        PluginId: string;
        IsRenderable: boolean;
        IsQueryModifier: boolean;
        modifyQuery(query: IQuery): void;
    }
}
declare module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import HideoutClientConfiguration = PowerTables.Plugins.Hideout.IHideoutClientConfiguration;
    interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
    }
    class HideoutPlugin extends PluginBase<HideoutClientConfiguration> implements IQueryPartProvider {
        private _element;
        private _parentElement;
        private _visibleColumn;
        private _hiddenColumn;
        ColumnsStates: IColumnState[];
        constructor();
        init(table: PowerTable, configuration: PluginConfiguration): void;
        subscribe(e: EventsManager): void;
        constructColumnStates(): void;
        onHeaderDrawn(column: IColumn): void;
        onFilterDrawn(column: IColumn): void;
        onCellDrawn(c: ICell): void;
        isColumnVisible(columnName: string): boolean;
        isColumnInstanceVisible(col: IColumn): boolean;
        hideColumnByName(rawColname: string): void;
        hideColumnInstance(c: IColumn): void;
        showColumnByName(rawColname: string): void;
        showColumnInstance(c: IColumn): void;
        toggleColumnByName(columnName: string): boolean;
        subscribeEvents(parentElement: JQuery): void;
        IsToolbarPlugin: boolean;
        PluginId: string;
        IsRenderable: boolean;
        IsQueryModifier: boolean;
        modifyQuery(query: IQuery): void;
    }
}
declare module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    class CheckboxifyPlugin extends RenderableComponent implements IPlugin, IQueryPartProvider {
        private _configuration;
        private _masterTable;
        private _selectAllTemplate;
        private _checkboxTemplate;
        private _selectedItems;
        private _currentChecks;
        private _selectAll;
        private _visibleAll;
        constructor();
        getSelection(): string[];
        init(table: PowerTable, configuration: PluginConfiguration): void;
        checkVisibleAll(response: IPowerTablesResponse): void;
        onBeforeResponse(response: IPowerTablesResponse): void;
        onAfterRespons(response: IPowerTablesResponse): void;
        onColumnsRender(): void;
        onFiltersRender(): void;
        onRowRender(r: PowerTables.IRow): void;
        resetSelection(): void;
        selectAll(selected: boolean): void;
        selectItem(itemId: string, selected: boolean): void;
        IsToolbarPlugin: boolean;
        PluginId: string;
        IsRenderable: boolean;
        IsQueryModifier: boolean;
        modifyQuery(query: PowerTables.IQuery): void;
    }
}
declare module PowerTables {
    import ResponseInfoClientConfiguration = PowerTables.Plugins.ResponseInfo.IResponseInfoClientConfiguration;
    class ResponseInfoPlugin extends PluginBase<ResponseInfoClientConfiguration> {
        private _element;
        constructor();
        subscribe(e: EventsManager): void;
        onResponse(response: IPowerTablesResponse): void;
        IsToolbarPlugin: boolean;
        PluginId: string;
        IsRenderable: boolean;
        subscribeEvents(parentElement: JQuery): void;
        IsQueryModifier: boolean;
        getTemplateContent(): string;
    }
}
declare module PowerTables {
    import TotalClientConfiguration = PowerTables.Plugins.Total.ITotalClientConfiguration;
    class TotalPlugin extends PluginBase<TotalClientConfiguration> {
        private _element;
        TotalRow: JQuery;
        constructor();
        subscribe(e: EventsManager): void;
        onResponse(response: IPowerTablesResponse): void;
        IsToolbarPlugin: boolean;
        PluginId: string;
        IsRenderable: boolean;
        IsQueryModifier: boolean;
    }
}
declare module PowerTables {
    import ToolbarButtonsClientConfiguration = PowerTables.Plugins.Toolbar.IToolbarButtonsClientConfiguration;
    class ToolbarPlugin extends PluginBase<ToolbarButtonsClientConfiguration> {
        private _buttonConfigById;
        private _selectionListeners;
        private _btnsCounter;
        constructor();
        subscribe(e: EventsManager): void;
        onSelectionChanged(selection: string[]): void;
        private buildConfigCache(config);
        subscribeEvents(parentElement: JQuery): void;
        private disable(el);
        private enable(el);
        private setupButton(button, config);
        IsToolbarPlugin: boolean;
        PluginId: string;
        IsRenderable: boolean;
        IsQueryModifier: boolean;
    }
}
declare module PowerTables {
    import FormwatchClientConfiguration = PowerTables.Plugins.Formwatch.IFormwatchClientConfiguration;
    class FormwatchPlugin extends PluginBase<FormwatchClientConfiguration> implements IQueryPartProvider {
        IsQueryModifier: boolean;
        IsRenderable: boolean;
        PluginId: string;
        private _existingValues;
        private _filteringExecuted;
        private _timeouts;
        modifyQuery(query: IQuery): void;
        subscribe(e: EventsManager): void;
        fieldChange(fieldSelector: string, delay: number, element: HTMLInputElement, e: Event): void;
    }
}
