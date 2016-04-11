using System;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.ResponseInfo
{
    public static class ResponseInfoExtensions
    {
        public const string PluginId = "ResponseInfo";
        public static T WithResponseInfo<T>(this T c,string position = "lt", Action<IPluginConfiguration<ResponseInfoClientConfiguration>> ui = null) where T : IConfigurator
        {
            c.TableConfiguration.UpdatePluginConfig(PluginId, ui, position);
            return c;
        }

        public static Configurator<TSourceData, TTableData> WithResponseInfo<TSourceData, TTableData, TResponseData>
            (this Configurator<TSourceData, TTableData> conf,
            Func<PowerTablesData<TSourceData, TTableData>, TResponseData> responseDataEvaluator,
            Action<IPluginConfiguration<ResponseInfoClientConfiguration>> ui = null, string position = "lt")
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
            }, position);
            return conf;
        }
    }
}
