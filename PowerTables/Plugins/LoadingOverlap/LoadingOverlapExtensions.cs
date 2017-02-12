using System;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.LoadingOverlap
{
    public static class LoadingOverlapExtensions
    {
        public static T LoadingOverlap<T>(this T conf, Action<PluginConfigurationWrapper<LoadingOverlapUiConfig>> ui) where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig("LoadingOverlap", ui);
            return conf;
        }

        public static PluginConfigurationWrapper<LoadingOverlapUiConfig> Overlap(
            this PluginConfigurationWrapper<LoadingOverlapUiConfig> ui, OverlapMode what = OverlapMode.BodyOnly, string tempalteId = "loadingOverlap")
        {
            ui.Configuration.Overlaps[string.Format("${0}", what)] = tempalteId;
            return ui;
        }

        public static PluginConfigurationWrapper<LoadingOverlapUiConfig> Overlap(
            this PluginConfigurationWrapper<LoadingOverlapUiConfig> ui, string selector,string templateId = "loadingOverlap")
        {
            ui.Configuration.Overlaps[selector] = templateId;
            return ui;
        }
    }
}
