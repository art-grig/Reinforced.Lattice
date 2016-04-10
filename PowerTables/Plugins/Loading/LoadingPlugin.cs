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
        /// <param name="position">Plugin position</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> LoadingIndicator<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> conf, string position = null) where TTableData : new()
        {
            conf.TableConfiguration.ReplacePluginConfig(PluginId, null, position);
            return conf;
        }
    }
}
