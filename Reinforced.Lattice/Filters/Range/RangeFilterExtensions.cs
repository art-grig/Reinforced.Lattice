using System;
using System.Linq;
using System.Linq.Expressions;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;
using Reinforced.Lattice.Plugins;

namespace Reinforced.Lattice.Filters.Range
{
    /// <summary>
    /// Extension methods for RangeFilter
    /// </summary>
    public static class RangeFilterExtensions
    {
        /// <summary>
        /// Range filter plugin ID
        /// </summary>
        public const string PluginId = "RangeFilter";

        /// <summary>
        /// Attaches Range filter to specified column. 
        /// Range column filter supports 2 values (min. and max.) to be specified. 
        /// This filter filters out source query leaving records that are having value denoted by column that is in specified range (between min. and max.) 
        /// UI frontend for this filter (by default) is 2 text inputs specifying min and max value. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="sourceColumn">Matching source column to be filtered</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TSourceColumn> FilterRange<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            Action<ColumnPluginConfigurationWrapper<RangeFilterUiConfig,TTableColumn>> ui = null
            ) where TTableData : new()
        {
            var filter = FilterRangeNoUi(column, sourceColumn);
            FilterRangeUi(column,ui);
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
        /// <param name="ui">Filter UI builder</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TTableColumn> FilterRangeBy<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, RangeTuple<TTableColumn>, IQueryable<TSourceData>> filterDelegate,
            Action<ColumnPluginConfigurationWrapper<RangeFilterUiConfig,TTableColumn>> ui = null
            ) where TTableData : new()
        {
            var filter = FilterRangeNoUiBy(column, filterDelegate);
            FilterRangeUi(column, ui);
            return filter;
        }

        /// <summary>
        /// Attaches Range filter to specified column. 
        /// Range column filter supports 2 values (min. and max.) to be specified. 
        /// This filter filters out source query leaving records that are having value denoted by column that is in specified range (between min. and max.) 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="sourceColumn">Matching source column to be filtered</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TSourceColumn> FilterRangeNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn
            ) where TTableData : new()
        {
            var filter = RangeColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            column.Configurator.RegisterFilter(filter);
            return filter;
        }

        /// <summary>
        /// Attaches Range filter to specified column without UI
        /// Range column filter supports 2 values (min. and max.) to be specified. 
        /// This filter filters out source query leaving records that are having value denoted by column that is in specified range (between min. and max.) 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="filterDelegate">Filtering delegate</param>
        /// <returns>Fluent</returns>
        public static RangeColumnFilter<TSourceData, TTableColumn> FilterRangeNoUiBy<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, RangeTuple<TTableColumn>, IQueryable<TSourceData>> filterDelegate) where TTableData : new()
        {
            var filter = RangeColumnFilter<TSourceData, TTableColumn>.Create(column.ColumnProperty, column.Configurator, filterDelegate);
            column.Configurator.RegisterFilter(filter);
            return filter;
        }

        /// <summary>
        /// Attaches UI for Range filter to specified column. 
        /// UI frontend for this filter (by default) is 2 text inputs specifying min and max value. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns>Fluent</returns>
        public static void FilterRangeUi<TTableColumn>(this IColumnTargetProperty<TTableColumn> column,Action<ColumnPluginConfigurationWrapper<RangeFilterUiConfig,TTableColumn>> ui = null) 
        {
            column.UpdateFilterConfig(PluginId, ui);
        }

        /// <summary>
        /// Forces server to treat equal date ranges as necessarity of selecting the whole day
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <param name="f"></param>
        /// <param name="treat">When true, equal selected dates will be treated as whole day</param>
        /// <returns></returns>
        public static RangeColumnFilter<TSourceData, DateTime> TreatEqualDateAsWholeDay<TSourceData>(this RangeColumnFilter<TSourceData, DateTime> f, bool treat = true)
        {
            f.TreatEqualDateAsWholeDay = treat;
            return f;
        }

        /// <summary>
        /// Forces server to treat equal date ranges as necessarity of selecting the whole day
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <param name="f"></param>
        /// <param name="treat">When true, equal selected dates will be treated as whole day</param>
        /// <returns></returns>
        public static RangeColumnFilter<TSourceData, DateTime?> TreatEqualDateAsWholeDay<TSourceData>(this RangeColumnFilter<TSourceData, DateTime?> f, bool treat = true)
        {
            f.TreatEqualDateAsWholeDay = treat;
            return f;
        }
    }
}
