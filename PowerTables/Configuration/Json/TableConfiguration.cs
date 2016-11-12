using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Configuration.Json
{
    /// <summary>
    /// Configuration JSON object for whole table
    /// </summary>
    public class TableConfiguration
    {
        /// <summary>
        /// Appends empty filter if there are no filters for any columns. 
        /// This option fits good in case of table form-factor
        /// </summary>
        public string EmptyFiltersPlaceholder { get; set; }

        /// <summary>
        /// Templates prefix. It is used to distinguish several templates sets on single page from each other
        /// </summary>
        public string Prefix { get; set; }

        /// <summary>
        /// Root ID
        /// </summary>
        public string TableRootId { get; set; }

        /// <summary>
        /// URL for table requests (relative to website root)
        /// </summary>
        public string OperationalAjaxUrl { get; set; }

        /// <summary>
        /// When true, table data will be loaded immediately after initialization
        /// </summary>
        public bool LoadImmediately { get; set; }

        /// <summary>
        /// Mandatory object to interact with datepicker
        /// </summary>
        public DatepickerOptions DatepickerOptions { get; set; }

        /// <summary>
        /// Table columns
        /// </summary>
        public List<ColumnConfiguration> Columns { get; set; }

        /// <summary>
        /// Custom plugins configuration. Key: pluginId, Value: configuration
        /// </summary>
        public List<PluginConfiguration> PluginsConfiguration { get; set; }

        /// <summary>
        /// Static data that will be embedded into table and sent within each request
        /// </summary>
        public string StaticData { get; set; }

        /// <summary>
        /// Core template IDs
        /// </summary>
        public CoreTemplateIds CoreTemplates { get; private set; }

        /// <summary>
        /// Object's key fields. Necessary for some operations
        /// </summary>
        public string[] KeyFields { get; set; }
       
        /// <summary>
        /// Function that will be called after tables initialization
        /// </summary>
        public JRaw CallbackFunction { get; set; }

        /// <summary>
        /// Function that should consume IRow instance and return template name for this particular row.
        /// Return null/empty/undefined will let system to choose default template
        /// </summary>
        public JRaw TemplateSelector { get; set; }

        /// <summary>
        /// Function that shows user messages.
        /// Function type is (msg: ITableMessage) => void
        /// </summary>
        public JRaw MessageFunction { get; set; }

        /// <summary>
        /// Cell/row event subscriptions
        /// </summary>
        public List<ConfiguredSubscriptionInfo> Subscriptions { get; private set; }

        /// <summary>
        /// Function that will be invoked before performing query
        /// Function type is (query:IPowerTableRequest,scope:QueryScope,continueFn:any) => void
        /// </summary>
        public JRaw QueryConfirmation { get; set; }

        /// <summary>
        /// Configuration of selection mechanism
        /// </summary>
        public SelectionConfiguration SelectionConfiguration { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public TableConfiguration()
        {
            Columns = new List<ColumnConfiguration>();
            PluginsConfiguration = new List<PluginConfiguration>();
            LoadImmediately = true;
            Prefix = "lt";
            CoreTemplates = new CoreTemplateIds();
            Subscriptions = new List<ConfiguredSubscriptionInfo>();
            SelectionConfiguration = new SelectionConfiguration();
        }

        /// <summary>
        /// Gets or sets table prefetched data
        /// </summary>
        public object[] PrefetchedData { get; internal set; }

    }

    /// <summary>
    /// Event subscription JSON configuration
    /// </summary>
    public class ConfiguredSubscriptionInfo
    {
        /// <summary>
        /// Is row event subscription mentioned
        /// </summary>
        public bool IsRowSubscription { get; set; }

        /// <summary>
        /// Column name (must be null in case of IsRowSubscription st to true
        /// </summary>
        public string ColumnName { get; set; }

        /// <summary>
        /// Element selector (relative to row or cell)
        /// </summary>
        public string Selector { get; set; }

        /// <summary>
        /// Filtered DOM event. DomEvent class can be used here
        /// </summary>
        public string DomEvent { get; set; }

        /// <summary>
        /// Handler function
        /// </summary>
        public JRaw Handler { get; set; }
    }

    /// <summary>
    /// Set of IDs of core templates
    /// </summary>
    public class CoreTemplateIds
    {
        /// <summary>
        /// Layout template ID (default is "layout")
        /// </summary>
        public string Layout { get; set; }

        /// <summary>
        /// Plugin wrapper template ID (default is "pluginWrapper")
        /// </summary>
        public string PluginWrapper { get; set; }

        /// <summary>
        /// Row wrapper template ID (default is "rowWrapper")
        /// </summary>
        public string RowWrapper { get; set; }

        /// <summary>
        /// Cell wrapper template ID (default is "cellWrapper")
        /// </summary>
        public string CellWrapper { get; set; }

        /// <summary>
        /// Header wrapper template ID (default is "headerWrapper")
        /// </summary>
        public string HeaderWrapper { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public CoreTemplateIds()
        {
            Layout = "layout";
            PluginWrapper = "pluginWrapper";
            RowWrapper = "rowWrapper";
            HeaderWrapper = "headerWrapper";
            CellWrapper = "cellWrapper";
        }
    }

    /// <summary>
    /// Table column JSON configuration
    /// </summary>
    public class ColumnConfiguration
    {
        /// <summary>
        /// Column title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Column display order
        /// </summary>
        public double DisplayOrder { get; set; }

        /// <summary>
        /// Column description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Random metadata object that can be bound within column
        /// </summary>
        public object Meta { get; set; }

        /// <summary>
        /// Raw column name
        /// </summary>
        public string RawColumnName { get; set; }

        /// <summary>
        /// Handlebars template ID for rendering
        /// </summary>
        public string CellRenderingTemplateId { get; set; }

        /// <summary>
        /// Inline JS function that takes table row data object (TTableData) and 
        /// turns it into HTML content that will be placed inside wrapper
        /// </summary>
        public JRaw CellRenderingValueFunction { get; set; }

        /// <summary>
        /// CLR column type
        /// </summary>
        public string ColumnType { get; set; }

        /// <summary>
        /// Is column data-only (never being displayed actually)
        /// </summary>
        public bool IsDataOnly { get; set; }

        /// <summary>
        /// Is column type Enumeration
        /// </summary>
        public bool IsEnum { get; set; }

        /// <summary>
        /// Is column nullable
        /// </summary>
        public bool IsNullable { get; set; }

        /// <summary>
        /// Javascript function used to evaluate column value on the client-side.
        /// Function signature: (dataObject:any) => any
        /// </summary>
        public JRaw ClientValueFunction { get; set; }

        /// <summary>
        /// Function that should consume IRow instance and return template name for this particular row.
        /// Return null/empty/undefined will let system to choose default template
        /// </summary>
        public JRaw TemplateSelector { get; set; }

        /// <summary>
        /// Special column does not represent any data and supposed to be handled by plugin from inside table
        /// </summary>
        public bool IsSpecial { get; set; }
    }

    /// <summary>
    /// Plugin JSON configuration
    /// </summary>
    public class PluginConfiguration
    {
        /// <summary>
        /// Default constructor
        /// </summary>
        public PluginConfiguration(string pluginId)
        {
            PluginId = pluginId;
            Placement = "lt";
        }

        /// <summary>
        /// Plugin ID
        /// </summary>
        public string PluginId { get; set; }

        /// <summary>
        /// Plugin placement
        /// </summary>
        public string Placement { get; set; }

        /// <summary>
        /// Plugin configuration itself
        /// </summary>
        public object Configuration { get; set; }

        /// <summary>
        /// Plugin order among particular placement
        /// </summary>
        public int Order { get; set; }

        /// <summary>
        /// Overridable plugin template Id
        /// </summary>
        public string TemplateId { get; set; }

    }

    /// <summary>
    /// Description of command to be performed on table
    /// </summary>
    public class TableCommandDescription
    {
        /// <summary>
        /// Gets or sets command name
        /// </summary>
        public string Command { get; set; }

        /// <summary>
        /// Gets or sets confirmation form fields configuration
        /// </summary>
        public List<FormwatchFieldData> ConfirmationFormConfiguration { get; set; }

        /// <summary>
        /// Gets or sets template ID for confirmation button's action
        /// </summary>
        public string ConfirmationTemplateId { get; set; }

        /// <summary>
        /// Gets or sets element selector where confirmation panel will be placed to
        /// </summary>
        public string ConfirmationTargetSelector { get; set; }

        /// <summary>
        /// Command handler viewmodel mixins
        /// </summary>
        public JRaw ConfirmationWindowViewModel { get; set; }

    }



    public class SelectionConfiguration
    {
        public SelectAllBehavior SelectAllBehavior { get; set; }

        public ResetSelectionBehavior ResetSelectionBehavior { get; set; }

        public JRaw CanSelectRowFunction { get; set; }

        public JRaw CanSelectCellFunction { get; set; }

        public string[] NonselectableColumns { get; set; }

        public bool SelectSingle { get; set; }
    }

    public enum SelectAllBehavior
    {
        AllVisible,
        OnlyIfAllDataVisible,
        AllLoadedData,
        Disabled
    }

    public enum ResetSelectionBehavior
    {
        DontReset,
        ServerReload,
        ClientReload
    }
}
