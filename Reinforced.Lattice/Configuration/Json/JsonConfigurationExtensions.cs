using System;
using System.Linq;
using System.Reflection;
using Reinforced.Lattice.Plugins;

namespace Reinforced.Lattice.Configuration.Json
{
    /// <summary>
    /// Set of extensions for working with JSON configuration
    /// </summary>
    public static class JsonConfigurationExtensions
    {
        /// <summary>
        /// Retrieves JSON column configuration by corresponding column's property info
        /// </summary>
        /// <param name="tconf">JSON table configuration</param>
        /// <param name="property">Column's property info</param>
        /// <returns>JSON column configuration</returns>
        public static ColumnConfiguration Column(this TableConfiguration tconf, PropertyInfo property)
        {
            var name = property.Name;
            var idx = tconf.Columns.Single(c => c.RawColumnName == name);
            return idx;
        }

        /// <summary>
        /// Replaces filter configuration for specified column
        /// </summary>
        /// <param name="column">Column usage</param>
        /// <param name="pluginId">Filter plugin ID</param>
        /// <param name="filterConfig">Filter configuration</param>
        /// <param name="order">Order among particular placement</param>
        public static void ReplaceFilterConfig(this IColumnConfigurator column, string pluginId, object filterConfig, int order = 0)
        {
            ReplacePluginConfig(column.TableConfigurator.TableConfiguration, pluginId, filterConfig,
                string.Concat("filter-", column.ColumnConfiguration.RawColumnName));
        }

        /// <summary>
        /// Replaces filter configuration for specified column
        /// </summary>
        /// <param name="column">Column usage</param>
        /// <param name="pluginId">Filter plugin ID</param>
        /// <param name="configuration">Filter configuration delegate</param>
        public static void UpdateFilterConfig<T, TTableColumn>(this IColumnTargetProperty<TTableColumn> column, string pluginId, Action<ColumnPluginConfigurationWrapper<T, TTableColumn>> configuration) where T : IProvidesColumnName, new()
        {
            var where = string.Concat("filter-", column.ColumnConfiguration.RawColumnName);

            PluginConfiguration config = column.TableConfigurator.TableConfiguration.GetPluginConfiguration(pluginId, where);
            if (config == null)
            {
                config = new PluginConfiguration(pluginId)
                {
                    Configuration = new T() { ColumnName = column.ColumnConfiguration.RawColumnName },
                    Placement = where,
                };

                column.TableConfigurator.TableConfiguration.PluginsConfiguration.Add(config);
            }

            var wpapper = new ColumnPluginConfigurationWrapper<T, TTableColumn>(config, column.ColumnConfiguration.RawColumnName);
            if (configuration != null) configuration(wpapper);
        }

        /// <summary>
        /// Replaces plugin configuration with whole new configuration
        /// </summary>
        /// <param name="conf">Table configuration</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="pluginConfig">Configuration object</param>
        /// <param name="placement">Plugin placement</param>
        /// <param name="order">Order among particular placement</param>
        public static void ReplacePluginConfig(this TableConfiguration conf, string pluginId, object pluginConfig, string placement = null, int order = 0)
        {
            var config = conf.GetPluginConfiguration(pluginId, placement);
            if (config == null)
            {
                config = new PluginConfiguration(pluginId);
                conf.PluginsConfiguration.Add(config);
            }
            config.Configuration = pluginConfig;
            config.Placement = placement;
            config.Order = order;

        }

        private static PluginConfiguration GetPluginConfiguration(this TableConfiguration conf, string pluginId, string placement = null)
        {
            var plugins = conf.PluginsConfiguration.Where(
                    c => c.PluginId == pluginId && (string.IsNullOrEmpty(placement) || c.Placement == placement)).ToArray();
            if (plugins.Length > 1)
            {
                throw new Exception(string.Format("It is unclear which {0} plugin is mentioned for configuration. You have {1}: at {2}. Please specify placement if you try to update any specific plugin instance. Otherwise please update instances separately."
                    , pluginId, plugins.Length, string.Join(", ", plugins.Select(c => c.Placement).ToArray())));
            }

            return plugins.Length == 0 ? null : plugins[0];
        }

        /// <summary>
        /// Updates or creates and updates configuration for specified plugin
        /// </summary>
        /// <typeparam name="TConfig">Plugin configuration type</typeparam>
        /// <param name="conf">Table configuration</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="pluginConfiguration">Configuration function</param>
        /// <param name="where">Specifies which plugin is mentioned</param>
        public static void UpdatePluginConfig<TConfig>(this TableConfiguration conf, string pluginId, Action<PluginConfigurationWrapper<TConfig>> pluginConfiguration, string where = null)
            where TConfig : new()
        {
            PluginConfiguration config = conf.GetPluginConfiguration(pluginId, where);
            if (config == null)
            {
                config = new PluginConfiguration(pluginId)
                {
                    Configuration = new TConfig(),
                    Placement = where
                };
                conf.PluginsConfiguration.Add(config);
                if (config.Configuration is IProvidesTemplate)
                {
                    config.TemplateId = ((IProvidesTemplate)config.Configuration).DefaultTemplateId;
                }
            }

            var wpapper = new PluginConfigurationWrapper<TConfig>(config);
            if (pluginConfiguration != null) pluginConfiguration(wpapper);
        }

        /// <summary>
        /// Retrieves configuration for specified plugin
        /// </summary>
        /// <typeparam name="TConfig">Plugin configuration type</typeparam>
        /// <param name="conf">Table JSON configuration</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="placement">Plugin placement</param>
        /// <returns></returns>
        public static TConfig GetPluginConfig<TConfig>(this TableConfiguration conf, string pluginId, string placement = null) where TConfig : class
        {
            var config = conf.GetPluginConfiguration(pluginId, placement);
            if (config == null) return null;
            return (TConfig)config.Configuration;
        }
    }
}
