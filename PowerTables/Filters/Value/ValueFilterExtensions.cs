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
        /// <param name="placeholder">Placeholder text</param>
        /// <param name="inputDelay">Delay between typing to filter and request being sent to server</param>
        /// <returns></returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> FilterValue<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> sourceColumn, string placeholder = null, int inputDelay = 500
            ) where TTableData : new()
        {
            if (string.IsNullOrEmpty(placeholder)) placeholder = column.ColumnConfiguration.Title;
            var filter = ValueColumnFilter<TSourceData, TSourceColumn>.Create(column.ColumnProperty, column.Configurator, sourceColumn);
            ValueFilterUiConfig clientConfig = new ValueFilterUiConfig
            {
                Placeholder = placeholder,
                InputDelay = inputDelay
            };
            filter.ClientConfig = clientConfig;
            column.Configurator.RegisterFilter(filter);
            column.ColumnConfiguration.ReplaceFilterConfig(PluginId, clientConfig);
            return filter;
        }

        /// <summary>
        /// Specifies raw default value for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="columnFilter">Filter</param>
        /// <param name="value">Raw value string</param>
        /// <returns>Fluent</returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> RawDefault<TSourceData, TSourceColumn>(
            this ValueColumnFilter<TSourceData, TSourceColumn> columnFilter, string value)
        {
            var fc = columnFilter.ClientConfig as ValueFilterUiConfig;
            if (fc != null)
            {
                fc.DefaultValue = value;
                return columnFilter;
            }
            var lfc = columnFilter.ClientConfig as SelectFilterUiConfig;
            if (lfc != null)
            {
                lfc.Items.ForEach(c => c.Selected = false);
                if (value != null)
                {
                    var selected = lfc.Items.FirstOrDefault(c => c.Value == value);
                    if (selected != null)
                    {
                        selected.Selected = true;
                    }
                    else
                    {
                        throw new Exception(String.Format(
                            "Cannot find item in list with value '{0}' to make it default", value));
                    }
                }
                return columnFilter;
            }

            throw new Exception("Seems that there is something behind that value filter with completely different configuration. And it is not possible to specify default value for that. Sorry. Please remove .Default/.RawDefault call.");

        }

        /// <summary>
        /// Sets default value for ValueFilter. This value will be converted to string.
        /// This value will be set initially after table loading and used for filtering
        /// </summary>
        /// <param name="columnFilter">Filter</param>
        /// <param name="value">Default value object</param>
        /// <returns>Fluent</returns>
        public static ValueColumnFilter<TSourceData, TSourceColumn> Default<TSourceData, TSourceColumn>(
            this ValueColumnFilter<TSourceData, TSourceColumn> columnFilter, TSourceColumn value)
        {
            return columnFilter.RawDefault(columnFilter.Configurator.ConvertDefaultValue(value));
        }

        
    }
}
