using System;
using System.Linq;
using System.Linq.Expressions;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Plugins;

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
            Action<ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TTableColumn>> ui = null
            ) where TTableData : new()
        {
            var filter = FilterValueNoUi(column, sourceColumn);
            FilterValueUi(column, ui);
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
        public static ValueColumnFilter<TSourceData, TTableColumn> FilterValueBy<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, TTableColumn, IQueryable<TSourceData>> filterDelegate,
            Action<ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TTableColumn>> ui = null
            ) where TTableData : new()
        {
            var filter = FilterValueNoUiBy(column, filterDelegate);
            FilterValueUi(column, ui);
            return filter;
        }

        /// <summary>
        /// Forces value filter to compare inly dates, ignoring time during client filtering
        /// </summary>
        /// <param name="filter">Filter configuration</param>
        /// <param name="compare"></param>
        /// <returns>Fluent</returns>
        public static ValueColumnFilter<TSourceData, DateTime> CompareOnlyDates<TSourceData>(this ValueColumnFilter<TSourceData, DateTime> filter,bool compare = true)
        {
            filter.CompareOnlyDates = compare;
            return filter;
        }

        /// <summary>
        /// Forces value filter to compare inly dates, ignoring time during client filtering
        /// </summary>
        /// <param name="filter">Filter configuration</param>
        /// <param name="compare"></param>
        /// <returns>Fluent</returns>
        public static ValueColumnFilter<TSourceData, DateTime?> CompareOnlyDates<TSourceData>(this ValueColumnFilter<TSourceData, DateTime?> filter, bool compare = true)
        {
            filter.CompareOnlyDates = compare;
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
        public static ValueColumnFilter<TSourceData, TTableColumn> FilterValueNoUiBy<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Func<IQueryable<TSourceData>, TTableColumn, IQueryable<TSourceData>> filterDelegate
            ) where TTableData : new()
        {
            var filter = ValueColumnFilter<TSourceData, TTableColumn>.Create(column.ColumnProperty, column.Configurator, filterDelegate);
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
        public static void FilterValueUi<TTableColumn>(
            this IColumnTargetProperty<TTableColumn> column,
            Action<ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TTableColumn>> ui = null
            )
        {
            column.UpdateFilterConfig<ValueFilterUiConfig, TTableColumn>(PluginId, a =>
            {
                a.Configuration.ColumnName = column.ColumnConfiguration.RawColumnName;
                a.Placeholder(column.ColumnConfiguration.Title);
                if (ui != null) ui(a);
            });
        }

        /// <summary>
        /// Specifies default value for filter. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="value">Filter default value</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TColumn> Default<TColumn>(this ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TColumn> config, TColumn value) where TColumn : class
        {
            config.Configuration.DefaultValue = ValueConverter.ToFilterDefaultString(value);
            return config;
        }


        /// <summary>
        /// Forces value filter to compare inly dates, ignoring time during client filtering
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="compare"></param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<ValueFilterUiConfig, DateTime> CompareOnlyDates(this ColumnPluginConfigurationWrapper<ValueFilterUiConfig, DateTime> config, bool compare = true)
        {
            config.Configuration.CompareOnlyDates = compare;
            return config;
        }

        /// <summary>
        /// Forces value filter to compare inly dates, ignoring time during client filtering
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="compare"></param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<ValueFilterUiConfig, DateTime?> CompareOnlyDates(this ColumnPluginConfigurationWrapper<ValueFilterUiConfig, DateTime?> config, bool compare = true)
        {
            config.Configuration.CompareOnlyDates = compare;
            return config;
        }

        /// <summary>
        /// Specifies default value for filter. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="nullValue">Filter default value</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TColumn?> Default<TColumn>(this ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TColumn?> config, TColumn? nullValue) where TColumn : struct
        {
            config.Configuration.DefaultValue = ValueConverter.ToFilterDefaultString(nullValue);
            return config;
        }

        /// <summary>
        /// Specifies default value for filter. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="value">Filter default value</param>
        /// <returns>Fluent</returns>
        public static ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TColumn> Default<TColumn>(this ColumnPluginConfigurationWrapper<ValueFilterUiConfig, TColumn> config, TColumn? value) where TColumn : struct
        {
            config.Configuration.DefaultValue = ValueConverter.ToFilterDefaultString(value);
            return config;
        }

        /// <summary>
        /// Configures filter's placeholder label
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="placeholder">Placeholder label</param>
        /// <returns>Fluent</returns>
        public static PluginConfigurationWrapper<ValueFilterUiConfig> Placeholder(this PluginConfigurationWrapper<ValueFilterUiConfig> config, string placeholder)
        {
            config.Configuration.Placeholder = placeholder;
            return config;
        }

    }
}
