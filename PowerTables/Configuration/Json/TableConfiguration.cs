using System;
using System.Collections.Generic;

using Newtonsoft.Json.Linq;

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
        /// DateTime format used on server to parse dates from client
        /// </summary>
        public string ServerDateTimeFormat { get; set; }

        /// <summary>
        /// JS-Date format used as literal on client-side
        /// </summary>
        public string ClientDateTimeFormat { get; set; }

        /// <summary>
        /// Function that turns input element to datapicker
        /// </summary>
        public JRaw DatePickerFunction { get; set; }

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

        public TableConfiguration()
        {
            Columns = new List<ColumnConfiguration>();
            PluginsConfiguration = new List<PluginConfiguration>();
            LoadImmediately = true;
            Prefix = "lt";
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
    }
    
    /// <summary>
    /// Plugin JSON configuration
    /// </summary>
    public class PluginConfiguration
    {
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
        
    }
}
