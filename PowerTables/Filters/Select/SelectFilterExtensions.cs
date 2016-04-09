using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Filters.Value;

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
            Action<SelectFilterUiConfig> ui = null) where TTableData : new()
        {

            var filter = FilterSelectNoUi(column, sourceColumn);
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
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterSelect<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, TSourceColumn, IQueryable<TSourceData>> filterDelegate,
            Action<SelectFilterUiConfig> ui = null) where TTableData : new()
        {

            var filter = FilterSelectNoUi(column, filterDelegate);
            FilterSelectUi(column, ui);
            return filter;
        }

        /// <summary>
        /// Attaches select list filter to specified column with no UI
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="sourceColumn">Source data column</param>
        /// <returns>Filter fluent</returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterSelectNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            var configurator = column;
            configurator.TableConfigurator.RegisterFilter(filter);
            return filter;
        }

        /// <summary>
        /// Attaches select list filter to specified column with no UI
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="filterDelegate">Filtering function base on value received from filter</param>
        /// <returns>Filter fluent</returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterSelectNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, TSourceColumn, IQueryable<TSourceData>> filterDelegate) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, filterDelegate);
            var configurator = column;
            configurator.TableConfigurator.RegisterFilter(filter);
            return filter;
        }

        /// <summary>
        /// Specifies UI for select filter on specified column
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="ui">UI builder</param>
        public static void FilterSelectUi<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
           Action<SelectFilterUiConfig> ui = null) where TTableData : new()
        {
            SelectFilterUiConfig cc = new SelectFilterUiConfig();
            cc.ColumnName = column.ColumnProperty.Name;

            if (ui != null) ui(cc);
            column.ReplaceFilterConfig(PluginId, cc);
        }

    }
}
