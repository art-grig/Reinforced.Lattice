using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.MouseSelect
{
    public static class MouseSelectExtensions
    {
        public const string PluginId = "MouseSelect";

        public static T MouseSelect<T>(this T conf, Action<PluginConfigurationWrapper<MouseSelectUiConfig>> ui) where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig(PluginId, ui);
            return conf;
        }
    }
}
