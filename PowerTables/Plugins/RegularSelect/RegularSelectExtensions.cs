using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.RegularSelect
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
