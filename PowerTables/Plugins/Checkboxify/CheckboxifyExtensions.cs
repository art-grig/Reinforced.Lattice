using System;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.Checkboxify
{
    /// <summary>
    /// Extensions for checkboxify plugin
    /// </summary>
    public static class CheckboxifyExtensions
    {
        public const string PluginId = "Checkboxify";

        /// <summary>
        /// Appends select checkboxes at the left of the table making them handle selection
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conf">Table</param>
        /// <param name="columnConf">Checkboxify column configuration</param>
        /// <param name="ui">UI configuration for checkboxify</param>
        /// <returns>Fluent</returns>
        public static T Checkboxify<T>(this T conf, Action<IColumnTargetProperty<string>> columnConf = null,
            Action<PluginConfigurationWrapper<CheckboxifyUiConfig>> ui = null ) where T : IConfigurator
        {
            if (conf.HasColumn("_checkboxify")) return conf;

            var cc = conf.AddUiColumn<string>("_checkboxify", " ", -1);
            cc.TemplateId("checkboxifyCell");
            cc.SubscribeCellEvent(c => c.Handle("click", "function(c) { c.Master.Selection.toggleDisplayingRow(c.Row); }"));
            if (columnConf != null) columnConf(cc);
            conf.TableConfiguration.UpdatePluginConfig<CheckboxifyUiConfig>(PluginId, ui);
            return conf;
        }

        public static PluginConfigurationWrapper<CheckboxifyUiConfig> SelectAllTemplateId(
            this PluginConfigurationWrapper<CheckboxifyUiConfig> c, string templateId)
        {
            c.Configuration.SelectAllTemplateId = templateId;
            return c;
        }
    }
}
