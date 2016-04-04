using System;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Toolbar
{
    public static class ToolbarExtensions
    {
        public const string PluginId = "Toolbar";

        /// <summary>
        /// Adds toolbar to table
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conf">Table configurator</param>
        /// <param name="position">Toolbar position</param>
        /// <param name="toolbar">Toolbar confguration action</param>
        /// <returns>Fluent</returns>
        public static T Toolbar<T>(this T conf, string position, Action<ToolbarBuilder> toolbar) where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig<ToolbarButtonsClientConfiguration>(PluginId, c =>
            {
                ToolbarBuilder tb = new ToolbarBuilder(c.Buttons);
                toolbar(tb);
            }, position);
            return conf;
        }
    }
}
