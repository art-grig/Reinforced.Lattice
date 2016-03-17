using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.ResponseProcessing;

namespace PowerTables.Plugins.Total
{
    public class TotalResponseModifier<TSourceData, TTableData> : IResponseModifier where TTableData : new()
    {
        private readonly TotalCalculatorBuilder<TSourceData, TTableData> _calculator;

        public TotalResponseModifier(TotalCalculatorBuilder<TSourceData, TTableData> calculator)
        {
            _calculator = calculator;
        }

        public void ModifyResponse(PowerTablesData data, PowerTablesResponse response)
        {
            TotalResponse tr = new TotalResponse() { TotalsForColumns = new Dictionary<string, string>() };
            var gData = new PowerTablesData<TSourceData, TTableData>(data);
            foreach (var keyValuePair in _calculator.Calculators)
            {
                var result = keyValuePair.Value.DynamicInvoke(gData);
                tr.TotalsForColumns[keyValuePair.Key] = result.ToString();
            }
            response.AdditionalData[TotalExtensions.PluginId] = tr;
        }
    }
}
