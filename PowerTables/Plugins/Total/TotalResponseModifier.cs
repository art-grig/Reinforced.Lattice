using System.Collections.Generic;
using Reinforced.Lattice.Processing;

namespace Reinforced.Lattice.Plugins.Total
{
    /// <summary>
    /// Response modifier that prepares data for totals plugin
    /// </summary>
    public class TotalResponseModifier<TSourceData, TTableData> : IResponseModifier where TTableData : new()
    {
        private readonly TotalCalculatorBuilder<TSourceData, TTableData> _calculator;

        public TotalResponseModifier(TotalCalculatorBuilder<TSourceData, TTableData> calculator)
        {
            _calculator = calculator;
        }

        public void ModifyResponse(LatticeData data, LatticeResponse response)
        {
            TotalResponse tr = new TotalResponse() { TotalsForColumns = new Dictionary<string, object>() };
            var gData = new LatticeData<TSourceData, TTableData>(data);
            foreach (var keyValuePair in _calculator.Calculators)
            {
                var result = keyValuePair.Value.DynamicInvoke(gData);
                tr.TotalsForColumns[keyValuePair.Key] = result;
            }
            response.AdditionalData.Data[TotalExtensions.PluginId] = tr;
        }
    }
}
