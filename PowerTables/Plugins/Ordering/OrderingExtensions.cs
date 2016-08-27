using System;
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
        /// Override ordering template
        /// </summary>
        /// <param name="templateId">Ordering template ID</param>
        public static Configurator<TSourceData, TTableData> OrderingTemplateId<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> conf, string templateId = "ordering") where TTableData : new()
        {
            conf.TableConfiguration.UpdatePluginConfig<OrderingConfiguration>(PluginId, c =>
            {
                c.TemplateId = templateId;
            });
            return conf;
        }

        /// <summary>
        /// Makes specified column orderable and adds corresponding UI extension
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="expresion">OrderBy expression of source data</param>
        /// <param name="ui">Client ordering configuration</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn>
            Orderable<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> expresion, Action<OrderingUiConfigurationBuilder> ui = null)
            where TTableData : new()
        {
            OrderableNoUi(column, expresion);
            OrderableUi(column, ui);
            return column;
        }

        /// <summary>
        /// Makes specified column orderable and adds corresponding UI extension
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="expresion">OrderBy expression of source data</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn>
            OrderableNoUi<TSourceData, TTableData, TTableColumn, TSourceColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            Expression<Func<TSourceData, TSourceColumn>> expresion)
            where TTableData : new()
        {
            column.Configurator.RegisterOrderingExpression(column.ColumnProperty, expresion);
            return column;
        }

        /// <summary>
        /// Makes specified column orderable and adds corresponding UI extension
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="ui">Client ordering configuration</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn>
            OrderableUi<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column, Action<OrderingUiConfigurationBuilder> ui = null)
            where TTableData : new()
        {
            column.TableConfigurator.TableConfiguration.UpdatePluginConfig<OrderingConfiguration>(PluginId, c =>
            {
                OrderingUiConfigurationBuilder cc = new OrderingUiConfigurationBuilder(c, column.ColumnProperty.Name);
                if (ui != null) ui(cc);
            });
            return column;
        }
    }
}
