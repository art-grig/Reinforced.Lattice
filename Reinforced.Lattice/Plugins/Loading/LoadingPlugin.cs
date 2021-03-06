﻿using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.Loading
{
    /// <summary>
    /// "Loading" plugin 
    /// </summary>
    public static class LoadingPlugin
    {
        /// <summary>
        /// Loading plugin Id
        /// </summary>
        public const string PluginId = "Loading";

        /// <summary>
        /// Adds loading indicator to table (small badge that is being shown when operation is performing on table)
        /// </summary>
        /// <param name="conf">Table configuration</param>
        /// <param name="templateId">Overides Loading default template ID</param>
        /// <param name="where">Specifies Limit plugin placement - where it will be drawn</param>
        /// <returns></returns>
        public static T LoadingIndicator<T>(this T conf, string templateId = "loading", string where = null, int order = 0) where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig<LoadingUiConfig>(PluginId, cc =>
            {
                cc.Template(templateId);
                cc.Order = order;
            }, where);
            return conf;
        }
    }
}
