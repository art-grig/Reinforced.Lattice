using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Templating;

namespace PowerTables.Plugins.Loading
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
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="conf">Table configuration</param>
        /// <param name="templateId">Overides Loading default template ID</param>
        /// <param name="where">Specifies Limit plugin placement - where it will be drawn</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> LoadingIndicator<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> conf, string templateId = "loading", string where = null, int order = 0) where TTableData : new()
        {
            conf.TableConfiguration.UpdatePluginConfig<LoadingUiConfig>(PluginId, cc =>
            {
                cc.TemplateId(templateId);
                cc.Order = order;
            }, where);
            return conf;
        }
    }
}
