using System;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.ResponseInfo
{
    public static class ResponseInfoExtensions
    {
        public const string PluginId = "ResponseInfo";

        /// <summary>
        /// Provides table with short window containing response information
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="c"></param>
        /// <param name="ui">Response information UI builder</param>
        /// <param name="where">Plugin placement - to distinguish which instance to update. Can be omitted if you have single plugin instance per table.</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> 
            ResponseInfo<TSourceData, TTableData>
            (this Configurator<TSourceData, TTableData> c, 
            Action<IPluginConfiguration<ResponseInfoClientConfiguration>> ui, string where = null) 
            where TTableData : new()
        {
            c.TableConfiguration.UpdatePluginConfig(PluginId, ui, where);
            return c;
        }

        /// <summary>
        /// Provides table with short window containing response information that will be custom-evaluated 
        /// during each server request with specified action delegate
        /// </summary>
        /// <param name="conf"></param>
        /// <param name="responseDataEvaluator">Function evaluating response info on server side</param>
        /// <param name="ui">Response information UI builder</param>
        /// <param name="where">Plugin placement - to distinguish which instance to update. Can be omitted if you have single plugin instance per table.</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> ResponseInfo<TSourceData, TTableData, TResponseData>
            (this Configurator<TSourceData, TTableData> conf,
            Action<IPluginConfiguration<ResponseInfoClientConfiguration>> ui,
            Func<PowerTablesData<TSourceData, TTableData>, TResponseData> responseDataEvaluator,
             string where = null)
            where TTableData : new()
        {
            var arm = new ActionBasedResponseModifier<TSourceData, TTableData>((a, r) =>
            {
                r.AdditionalData[PluginId] = responseDataEvaluator(a);
            });
            conf.RegisterResponseModifier(arm);

            conf.TableConfiguration.UpdatePluginConfig<ResponseInfoClientConfiguration>(PluginId, pc =>
            {
                if (ui != null) ui(pc);
                pc.Configuration.ResponseObjectOverriden = true;
            }, where);
            return conf;
        }
    }
}
