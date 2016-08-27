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
        public static PluginConfigurationWrapper<RangeFilterUiConfig> RawDefault(this PluginConfigurationWrapper<RangeFilterUiConfig> config, string from,string to)
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
        public static ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> RangeDefault<TColumn>(this ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> config, TColumn from,TColumn to) where TColumn : class
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
        public static ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn?> RangeDefault<TColumn>(this ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn?> config, TColumn? from, TColumn? to) where TColumn : struct 
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
        public static ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> RangeDefault<TColumn>(this ColumnPluginConfigurationWrapper<RangeFilterUiConfig, TColumn> config, TColumn? from, TColumn? to) where TColumn : struct 
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
        public static PluginConfigurationWrapper<RangeFilterUiConfig> Placeholders(this PluginConfigurationWrapper<RangeFilterUiConfig> config, string from,string to)
        {
            config.Configuration.FromPlaceholder = from;
            config.Configuration.ToPlaceholder = to;
            return config;
        }

        /// <summary>
        /// Forces server to treat equal date ranges as necessarity of selecting the whole day
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <param name="f"></param>
        /// <param name="treat">When true, equal selected dates will be treated as whole day</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<RangeFilterUiConfig> TreatEqualDateAsWholeDay<TSourceData>(this PluginConfigurationWrapper<RangeFilterUiConfig> f, bool treat = true)
        {
            f.Configuration.TreatEqualDateAsWholeDay = treat;
            return f;
        }
    }
}
