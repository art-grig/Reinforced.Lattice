using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Configuration.Json
{
    public static class JsonConfigurationExtensions
    {
        public static ColumnConfiguration Column(this TableConfiguration tconf, PropertyInfo property)
        {
            var name = property.Name;
            var idx = tconf.Columns.Single(c => c.RawColumnName == name);
            return idx;
        }

        public static void ReplaceFilterConfig(this ColumnConfiguration tconf, string key, object filterConfig)
        {
            tconf.Filter = new ColumnFilterConfiguration() { FilterKey = key, FilterConfiguration = filterConfig };
        }

        public static TFilterConfig FilterConfig<TFilterConfig>(this ColumnConfiguration tconf) where TFilterConfig : class
        {
            return tconf.Filter as TFilterConfig;
        }

        public static void ReplacePluginConfig(this ColumnConfiguration conf, string pluginId, object pluginConfig)
        {
            conf.CellPluginsConfiguration[pluginId] = pluginConfig;
        }

        public static void ReplacePluginConfig(this TableConfiguration conf, string pluginId, object pluginConfig, PluginPosition placement)
        {
            conf.PluginsConfiguration[placement.GeneratePluginId(pluginId)] = new PluginConfiguration(pluginId)
            {
                Configuration = pluginConfig,
                Placement = placement.ToJsFriendly()
            };
        }

        public static TConfig GetPluginConfig<TConfig>(this TableConfiguration conf, string pluginId) where TConfig:class
        {
            if (!conf.PluginsConfiguration.ContainsKey(pluginId)) return null;
            var config = conf.PluginsConfiguration[pluginId];
            return (TConfig) config.Configuration;
        }
    }
}
