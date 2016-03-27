using System;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.ResponseInfo
{
    public static class ResponseInfoExtensions
    {
        public const string PluginId = "ResponseInfo";
        public static T WithResponseInfo<T>(this T c, string templateText = null, string position = null) where T : IConfigurator
        {
            ResponseInfoClientConfiguration pc = new ResponseInfoClientConfiguration()
            {
                TemplateText = templateText
            };
            c.TableConfiguration.ReplacePluginConfig(PluginId, pc, position);
            return c;
        }

        public static Configurator<TSourceData, TTableData> WithResponseInfo<TSourceData, TTableData, TResponseData>
            (this Configurator<TSourceData, TTableData> conf,
            Func<PowerTablesData<TSourceData, TTableData>, TResponseData> responseDataEvaluator,
            string templateText = null,
            string position = null)
            where TTableData : new()
        {
            var arm = new ActionBasedResponseModifier<TSourceData, TTableData>((a, r) =>
            {
                r.AdditionalData[PluginId] = responseDataEvaluator(a);
            });
            conf.RegisterResponseModifier(arm);
            ResponseInfoClientConfiguration pc = new ResponseInfoClientConfiguration()
            {
                TemplateText = templateText,
                ResponseObjectOverride = true
            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId, pc, position);
            return conf;
        }
    }
}
