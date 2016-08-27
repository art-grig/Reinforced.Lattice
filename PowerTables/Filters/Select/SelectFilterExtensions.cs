using System;
using System.Linq;
using System.Linq.Expressions;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Filters.Value;
using PowerTables.Plugins;

namespace PowerTables.Filters.Select
{
    public static class SelectFilterExtensions
    {
        public const string PluginId = "SelectFilter";

        /// <summary>
        /// Attaches select list filter to specified column
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="sourceColumn">Corresponding source column</param>
        /// <param name="ui">UI builder</param>
        /// <returns>Filter fluent</returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterSelect<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig,TTableColumn>> ui = null) where TTableData : new()
        {

            var filter = column.FilterValueNoUi(sourceColumn);
            FilterSelectUi(column,ui);
            return filter;
        }

        /// <summary>
        /// Attaches select list filter to specified column
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="filterDelegate">Filtering function base on value received from filter</param>
        /// <param name="ui">UI builder</param>
        /// <returns>Filter fluent</returns>
        public static ValueColumnFilter<TSourceData, TTableColumn> FilterSelectBy<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, TTableColumn, IQueryable<TSourceData>> filterDelegate,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig,TTableColumn>> ui = null) where TTableData : new()
        {

            var filter = column.FilterValueNoUiBy(filterDelegate);
            FilterSelectUi(column, ui);
            return filter;
        }

        /// <summary>
        /// Specifies UI for select filter on specified column
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="ui">UI builder</param>
        public static void FilterSelectUi<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
           Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig,TTableColumn>> ui = null) where TTableData : new()
        {

            column.UpdateFilterConfig(PluginId, ui);
        }

    }
}
