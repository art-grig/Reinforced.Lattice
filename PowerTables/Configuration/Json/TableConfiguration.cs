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
        /// Root ID
        /// </summary>
        public string TableRootId { get; set; }

        /// <summary>
        /// URL for table requests (relative to website root)
        /// </summary>
        public string OperationalAjaxUrl { get; set; }
        public string DefaultCellElement { get; set; }
        public string DefaultRowElement { get; set; }
        public bool LoadImmediately { get; set; }
        public string ServerDateTimeFormat { get; set; }
        public string ClientDateTimeFormat { get; set; }
        public JRaw DatePickerFunction { get; set; }
        public List<ColumnConfiguration> Columns { get; set; }
        
        public Dictionary<string, PluginConfiguration> PluginsConfiguration { get; set; }

        /// <summary>
        /// Not cloneable!
        /// </summary>
        public string StaticData { get; set; }

        public TableConfiguration(string[] rawColumnNames)
        {
            DefaultCellElement = "td";
            DefaultRowElement = "tr";
            RawColumnNames = rawColumnNames;
            Columns = new List<ColumnConfiguration>();
            PluginsConfiguration = new Dictionary<string, PluginConfiguration>();
            LoadImmediately = true;
        }

        public string[] RawColumnNames { get; set; }
        
    }

    public class ColumnConfiguration
    {
        public string Title { get; set; }
        public string RawColumnName { get; set; }
        public ColumnFilterConfiguration Filter { get; set; }
        public string CellRenderingTemplateId { get; set; }
        public JRaw CellRenderingHtmlFunction { get; set; }
        public JRaw CellRenderingValueFunction { get; set; }
        public Dictionary<string, object> CellPluginsConfiguration { get; set; }
        public string ColumnType { get; set; }
        public bool IsDataOnly { get; set; }
        public ColumnConfiguration()
        {
            CellPluginsConfiguration = new Dictionary<string, object>();
        }
    }
    public class ColumnFilterConfiguration
    {
        public string FilterKey { get; set; }
        public object FilterConfiguration { get; set; }
    }
    
    public class PluginConfiguration
    {
        public PluginConfiguration(string pluginId)
        {
            PluginId = pluginId;
        }

        public string PluginId { get; set; }
        public string Placement { get; set; }
        public object Configuration { get; set; }
        
    }
}
