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

        /// <summary>
        /// Provides table with totals row representing subtotals for particular columns
        /// </summary>
        /// <param name="calculators">Totals calculator builder</param>
        /// <param name="showOnTop">When true, totals line will be shown before data on current page. When false, it will be shown on the bottom of them</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> Totals<TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf,
            Action<TotalCalculatorBuilder<TSourceData, TTableData>> calculators,
            bool showOnTop = false
            ) where TTableData : new()
        {
            TotalCalculatorBuilder<TSourceData, TTableData> calc = new TotalCalculatorBuilder<TSourceData, TTableData>();
            calculators(calc);

            TotalClientConfiguration tcc = new TotalClientConfiguration()
            {
                ShowOnTop = showOnTop,
                ColumnsValueFunctions = calc.ValueFunctions.ToDictionary(c => c.Key, v => v.Value != null ? new JRaw(v.Value) : null),
                ColumnsCalculatorFunctions = calc.ClientCalculators.ToDictionary(c => c.Key, v => v.Value != null ? new JRaw(v.Value) : null)
            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId, tcc);
            var trr = new TotalResponseModifier<TSourceData,TTableData>(calc);
            conf.RegisterResponseModifier(trr);
            return conf;
        }
    }
}
