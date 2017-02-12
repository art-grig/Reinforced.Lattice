using System;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.MouseSelect
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
