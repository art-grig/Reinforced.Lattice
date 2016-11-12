using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.RegularSelect
{
    public static class RegularSelectExtensions
    {
        public const string PluginId = "RegularSelect";

        public static T RegularSelect<T>(this T conf, RegularSelectMode mode) where T : IConfigurator
        {
            conf.SubscribeAllCellsEvent(c => c.StreamEventToPlugin("mousedown", PluginId, "startSelection"));
            conf.SubscribeAllCellsEvent(c => c.StreamEventToPlugin("mouseenter", PluginId, "move"));
            conf.SubscribeAllCellsEvent(c => c.StreamEventToPlugin("mouseup", PluginId, "endSelection"));

            conf.TableConfiguration.UpdatePluginConfig<RegularSelectUiConfig>(PluginId,ui=>
            {
                ui.Configuration.Mode = mode;
            });
            return conf;
        }
    }
}
