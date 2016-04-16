using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.LoadingOverlap
{
    public static class LoadingOverlapExtensions
    {
        public static Configurator<TSourceData, TTargetData> LoadingOverlap<TSourceData, TTargetData>(
            this Configurator<TSourceData, TTargetData> conf, Action<PluginConfigurationWrapper<LoadingOverlapUiConfig>> ui) where TTargetData : new()
        {
            conf.TableConfiguration.UpdatePluginConfig("LoadingOverlap", ui);
            return conf;
        }

        public static PluginConfigurationWrapper<LoadingOverlapUiConfig> Overlap(
            this PluginConfigurationWrapper<LoadingOverlapUiConfig> ui, OverlapMode what = OverlapMode.BodyOnly)
        {
            ui.Configuration.OverlapMode = what;
            return ui;
        }
    }
}
