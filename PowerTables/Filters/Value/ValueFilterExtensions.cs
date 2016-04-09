using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Filters.Select;

namespace PowerTables.Filters.Value
{
    /// <summary>
    /// Extensions for ValueFilter
    /// </summary>
    public static class ValueFilterExtensions
    {
        public const string PluginId = "ValueFilter";

        /// <summary>
        /// Attaches simple value filter to column. 
        /// Value column filter supports specifying only one value. 
        /// This filter filters out source query leaving records that are having value denoted by column that is equal to specified value in filter. 
        /// UI frontend for this filter (by default) is textbox field. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="sourceColumn">Matching source column to be filtered</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns></returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterValue<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn,
            Action<ValueFilterUiConfig> ui = null
            ) where TTableData : new()
        {
            var filter = FilterValueNoUi(column, sourceColumn);
            FilterValueUi(column,ui);
            return filter;
        }

        /// <summary>
        /// Attaches simple value filter to column. 
        /// Value column filter supports specifying only one value. 
        /// This filter filters out source query leaving records that are having value denoted by column that is equal to specified value in filter. 
        /// UI frontend for this filter (by default) is textbox field. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="filterDelegate">Matching source column to be filtered</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns></returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterValue<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, TSourceColumn, IQueryable<TSourceData>> filterDelegate,
            Action<ValueFilterUiConfig> ui = null
            ) where TTableData : new()
        {
            var filter = FilterValueNoUi(column, filterDelegate);
            FilterValueUi(column, ui);
            return filter;
        }

        /// <summary>
        /// Attaches simple value filter to column. 
        /// Value column filter supports specifying only one value. 
        /// This filter filters out source query leaving records that are having value denoted by column that is equal to specified value in filter. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="sourceColumn">Matching source column to be filtered</param>
        /// <returns></returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterValueNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn
            ) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            column.Configurator.RegisterFilter(filter);
            return filter;
        }


        /// <summary>
        /// Attaches simple value filter to column. 
        /// Value column filter supports specifying only one value. 
        /// This filter filters out source query leaving records that are having value denoted by column that is equal to specified value in filter. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="filterDelegate">Matching source column to be filtered</param>
        /// <returns></returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterValueNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, TSourceColumn, IQueryable<TSourceData>> filterDelegate
            ) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, filterDelegate);
            column.Configurator.RegisterFilter(filter);
            return filter;
        }


        /// <summary>
        /// Attaches simple value filter to column. 
        /// Value column filter supports specifying only one value. 
        /// This filter filters out source query leaving records that are having value denoted by column that is equal to specified value in filter. 
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="ui">Filter UI builder</param>
        /// <returns></returns>
        public static void FilterValueUi<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Action<ValueFilterUiConfig> ui = null
            ) where TTableData : new()
        {
            ValueFilterUiConfig clientConfig = new ValueFilterUiConfig();
            clientConfig.ColumnName = column.ColumnProperty.Name;
            if (ui != null) ui(clientConfig);
            column.ReplaceFilterConfig(PluginId,clientConfig);
        }
        
    }
}
