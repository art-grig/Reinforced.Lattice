using System;
using Newtonsoft.Json;
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
        /// <param name="where">Toolbar position</param>
        /// <param name="toolbar">Toolbar confguration action</param>
        /// <param name="templateId">Overrides standard toolbar template ID</param>
        /// <param name="order">Plugin order among specified placement</param>
        /// <returns>Fluent</returns>
        public static T Toolbar<T>(this T conf, string where, Action<ToolbarBuilder> toolbar, string templateId = "toolbar",int order = 0) where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig<ToolbarButtonsClientConfiguration>(PluginId, c =>
            {
                ToolbarBuilder tb = new ToolbarBuilder(c.Configuration.Buttons);
                toolbar(tb);
                tb.AssignIds();
                c.Template(templateId);
                c.Order = order;
            }, where);
            return conf;
        }
    }
}
