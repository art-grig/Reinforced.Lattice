using System;
using System.Collections.Generic;
using System.Linq.Expressions;

using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Ordering
{
    /// <summary>
    /// Extension methods for ordering plugin
    /// </summary>
    public static class OrderingExtensions
    {
        public const string PluginId = "Ordering";

        /// <summary>
        /// Makes specified column orderable and adds corresponding UI extension
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="expresion">OrderBy expression of source data</param>
        /// <param name="defaultOrdering">Default ordering value</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn>
            Orderable<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> expresion,
            PowerTables.Ordering defaultOrdering = PowerTables.Ordering.Neutral)
            where TTableData : new()
        {
            column.Configurator.RegisterOrderingExpression(column.ColumnProperty, expresion);
            column.TableConfigurator.TableConfiguration.UpdatePluginConfig<OrderingConfiguration>(PluginId, c =>
            {
                c.DefaultOrderingsForColumns[column.ColumnProperty.Name] = defaultOrdering;
            });
            return column;
        }
    }

    /// <summary>
    /// Client per-column configuration for ordering. 
    /// See <see cref="OrderingExtensions"/>
    /// </summary>
    public class OrderingConfiguration
    {
        /// <summary>
        /// Default orderings for columns. Key - column RawName, Value - ordering direction
        /// </summary>
        public Dictionary<string, PowerTables.Ordering> DefaultOrderingsForColumns { get; set; }

        public OrderingConfiguration()
        {
            DefaultOrderingsForColumns = new Dictionary<string, PowerTables.Ordering>();
        }
    }
}
