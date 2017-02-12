using System;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.Reload
{
    public static class ReloadExtensions
    {
        public const string PluginId = "Reload";

        /// <summary>
        /// Attaches reload button to table
        /// </summary>
        /// <param name="t"></param>
        /// <param name="where"></param>
        /// <param name="ui"></param>
        /// <returns></returns>
        public static T ReloadButton<T>(this T t, Action<PluginConfigurationWrapper<ReloadUiConfiguration>> ui, string where = "") where T : IConfigurator
        {
            t.TableConfiguration.UpdatePluginConfig(PluginId, ui, where);
            return t;
        }

        /// <summary>
        /// Makes reload plugin render to specified
        /// </summary>
        /// <param name="t"></param>
        /// <param name="selector"></param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ReloadUiConfiguration> RenderTo(
            this PluginConfigurationWrapper<ReloadUiConfiguration> t, string selector)
        {
            t.Configuration.RenderTo = selector;
            return t;
        }

        /// <summary>
        /// Reload plugin will reload corresponding table forcibly. It means that it will make table discard all 
        /// previously loaded data and require fresh data from server-side
        /// </summary>
        /// <param name="t"></param>
        /// <param name="force">When true, reload button will initiate force reload</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<ReloadUiConfiguration> ForceReload(
            this PluginConfigurationWrapper<ReloadUiConfiguration> t, bool force = true)
        {
            t.Configuration.ForceReload = force;
            return t;
        }
    }

    


}
