using Newtonsoft.Json.Linq;
using PowerTables.Plugins;

namespace PowerTables.Filters.Range
{
    /// <summary>
    /// Set of extensions for Range filter UI configuration
    /// </summary>
    public static class RangeFilterUiConfigExtensions
    {
        /// <summary>
        /// Specifies raw default values for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="from">Raw value string for "from" box</param>
        /// <param name="to">Raw value for "to" box</param>
        /// <returns>Fluent</returns>
        public static PluginConfigurationWrapper<RangeFilterUiConfig> RawDefault(this PluginConfigurationWrapper<RangeFilterUiConfig> config, string from = null,
            string to = null)
        {
            config.Configuration.FromValue = from;
            config.Configuration.ToValue = to;
            return config;
        }


        /// <summary>
        /// Specifies raw default values for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="from">Raw value string for "from" box</param>
        /// <param name="to">Raw value for "to" box</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> Default<TColumn>(this ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> config, TColumn from = null,
            TColumn to = null) where TColumn : class
        {
            config.Configuration.FromValue = ValueConverter.ToFilterDefaultString(from);
            config.Configuration.ToValue = ValueConverter.ToFilterDefaultString(to);
            return config;
        }

        /// <summary>
        /// Specifies raw default values for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="from">Raw value string for "from" box</param>
        /// <param name="to">Raw value for "to" box</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn?> Default<TColumn>(this ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn?> config, TColumn? from = null,
            TColumn? to = null) where TColumn : struct 
        {
            config.Configuration.FromValue = ValueConverter.ToFilterDefaultString(from);
            config.Configuration.ToValue = ValueConverter.ToFilterDefaultString(to);
            return config;
        }

        /// <summary>
        /// Specifies raw default values for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="from">Raw value string for "from" box</param>
        /// <param name="to">Raw value for "to" box</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> Default<TColumn>(this ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> config, TColumn? from = null,
            TColumn? to = null) where TColumn : struct 
        {
            config.Configuration.FromValue = ValueConverter.ToFilterDefaultString(from);
            config.Configuration.ToValue = ValueConverter.ToFilterDefaultString(to);
            return config;
        }

        /// <summary>
        /// Specifies raw default values for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="from">Raw value string for "from" box</param>
        /// <param name="to">Raw value for "to" box</param>
        /// <returns>Fluent</returns>
        public static PluginConfigurationWrapper<RangeFilterUiConfig> Placeholders(this PluginConfigurationWrapper<RangeFilterUiConfig> config, string from = null,
            string to = null)
        {
            config.Configuration.FromPlaceholder = from;
            config.Configuration.ToPlaceholder = to;
            return config;
        }
    }
}
