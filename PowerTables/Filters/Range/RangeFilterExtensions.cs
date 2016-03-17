using System;
using System.Linq;
using System.Linq.Expressions;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Filters.Range
{
    /// <summary>
    /// Extension methods for RangeFilter
    /// </summary>
    public static class RangeFilterExtensions
    {
        public const string PluginId = "RangeFilter";

        /// <summary>
        /// Attaches Range filter to specified column. 
        /// Range column filter supports 2 values (min. and max.) to be specified. 
        /// This filter filters out source query leaving records that are having value denoted by column that is in specified range (between min. and max.) 
        /// UI frontend for this filter (by default) is 2 text inputs specifying min and max value. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="sourceColumn">Matching source column to be filtered</param>
        /// <param name="fromPlaceholder">Placeholder for "from" box. Default is "From"</param>
        /// <param name="toPlaceholder">Placeholder for "to" box. Default is "To"</param>
        /// <param name="inputDelay">Delay between typing to filter and request being sent to server</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TSourceColumn> FilterRange<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            string fromPlaceholder = "From",
            string toPlaceholder = "To",
            int inputDelay = 500
            ) where TTableData : new()
        {
            column.ThrowIfFilterPresents();
            var filter = RangeColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            RangeFilterClientConfig clientConfig = new RangeFilterClientConfig
            {
                FromPlaceholder = fromPlaceholder,
                ToPlaceholder = toPlaceholder,
                InputDelay = inputDelay
            };
            filter.ClientConfig = clientConfig;
            column.Configurator.RegisterFilter(filter);
            column.ColumnConfiguration.ReplaceFilterConfig(PluginId, clientConfig);
            return filter;
        }

        /// <summary>
        /// Attaches Range filter to specified column. 
        /// Range column filter supports 2 values (min. and max.) to be specified. 
        /// This filter filters out source query leaving records that are having value denoted by column that is in specified range (between min. and max.) 
        /// UI frontend for this filter (by default) is 2 text inputs specifying min and max value. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="filterDelegate">Filtering delegate</param>
        /// <param name="fromPlaceholder">Placeholder for "from" box. Default is "From"</param>
        /// <param name="toPlaceholder">Placeholder for "to" box. Default is "To"</param>
        /// <param name="inputDelay">Delay between typing to filter and request being sent to server</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TTableColumn> FilterRange<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, RangeTuple<TTableColumn>, IQueryable<TSourceData>> filterDelegate,
            string fromPlaceholder = "From",
            string toPlaceholder = "To",
            int inputDelay = 500
            ) where TTableData : new()
        {
            column.ThrowIfFilterPresents();
            var filter = RangeColumnFilter<TSourceData, TTableColumn>.Create(column.ColumnProperty, column.Configurator, filterDelegate);
            RangeFilterClientConfig clientConfig = new RangeFilterClientConfig
            {
                FromPlaceholder = fromPlaceholder,
                ToPlaceholder = toPlaceholder,
                InputDelay = inputDelay
            };
            filter.ClientConfig = clientConfig;
            column.Configurator.RegisterFilter(filter);
            column.ColumnConfiguration.ReplaceFilterConfig(PluginId, clientConfig);
            return filter;
        }

        /// <summary>
        /// Specifies raw default values for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="columnFilter">Filter</param>
        /// <param name="from">Raw value string for "from" box</param>
        /// <param name="to">Raw value for "to" box</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TSourceColumn> RawDefault<TSourceData, TSourceColumn>(
            this RangeColumnFilter<TSourceData, TSourceColumn> columnFilter, string from = null, string to = null)
        {
            columnFilter.ClientConfig.FromValue = from;
            columnFilter.ClientConfig.ToValue = to;
            return columnFilter;
        }

        /// <summary>
        /// Sets default value for ValueFilter. This value will be converted to string.
        /// This value will be set initially after table loading and used for filtering
        /// </summary>
        /// <param name="columnFilter">Filter</param>
        /// <param name="from">Default value object for "from" box</param>
        /// <param name="to">Default value object for "to" box</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TSourceColumn> Default<TSourceData, TSourceColumn>(
            this RangeColumnFilter<TSourceData, TSourceColumn> columnFilter, TSourceColumn from = null, TSourceColumn to = null) where TSourceColumn : class
        {
            if (from != null)
            {
                columnFilter.ClientConfig.FromValue = columnFilter.Configurator.ConvertDefaultValue(from);
            }
            if (to != null)
            {
                columnFilter.ClientConfig.ToValue = columnFilter.Configurator.ConvertDefaultValue(to);
            }
            return columnFilter;
        }

        /// <summary>
        /// Sets default value for ValueFilter. This value will be converted to string.
        /// This value will be set initially after table loading and used for filtering
        /// </summary>
        /// <param name="columnFilter">Filter</param>
        /// <param name="from">Default value object for "from" box</param>
        /// <param name="to">Default value object for "to" box</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TSourceColumn> Default<TSourceData, TSourceColumn>(
            this RangeColumnFilter<TSourceData, TSourceColumn> columnFilter, TSourceColumn? from = null, TSourceColumn? to = null) where TSourceColumn : struct
        {
            if (from.HasValue)
            {
                columnFilter.ClientConfig.FromValue = columnFilter.Configurator.ConvertDefaultValue(from.Value);
            }
            if (to.HasValue)
            {
                columnFilter.ClientConfig.ToValue = columnFilter.Configurator.ConvertDefaultValue(to.Value);
            }
            return columnFilter;
        }
    }
}
