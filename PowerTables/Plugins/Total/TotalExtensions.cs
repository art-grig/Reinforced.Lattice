using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Total
{
    public static class TotalExtensions
    {
        public const string PluginId = "Total";

        public static Configurator<TSourceData, TTableData> Totals<TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf,
            Action<TotalCalculatorBuilder<TSourceData, TTableData>> calculators,
            bool showOnTop = false
            ) where TTableData : new()
        {
            TotalCalculatorBuilder<TSourceData, TTableData> calc = new TotalCalculatorBuilder<TSourceData, TTableData>(conf);
            calculators(calc);

            TotalClientConfiguration tcc = new TotalClientConfiguration()
            {
                ShowOnTop = showOnTop,
                ColumnsValueFunctions = calc.ValueFunctions.ToDictionary(c => c.Key, v => v.Value != null ? new JRaw(v.Value) : null)
            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId, tcc);
            var trr = new TotalResponseModifier<TSourceData,TTableData>(calc);
            conf.RegisterResponseModifier(trr);
            return conf;
        }
    }
}
