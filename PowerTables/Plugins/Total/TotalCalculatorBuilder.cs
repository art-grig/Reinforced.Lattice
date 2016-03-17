using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Plugins.Total
{
    public class TotalCalculatorBuilder<TSourceData, TTableData> where TTableData : new()
    {
        private Configurator<TSourceData, TTableData> _configurator;
        private readonly Dictionary<string, Delegate> _calculators = new Dictionary<string, Delegate>();
        private readonly Dictionary<string, string> _valueFunctions = new Dictionary<string, string>();
        public IReadOnlyDictionary<string, Delegate> Calculators { get { return _calculators; } }

        public IReadOnlyDictionary<string, string> ValueFunctions { get { return _valueFunctions; } }
        public TotalCalculatorBuilder(Configurator<TSourceData, TTableData> configurator)
        {
            _configurator = configurator;
        }


        public TotalCalculatorBuilder<TSourceData, TTableData> AddTotal<TTableColumn, TTotalType>(
            Expression<Func<TTableData, TTableColumn>> column,
            Func<PowerTablesData<TSourceData, TTableData>, TTotalType> calculator,
            string valueFunction = null
            )
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            _calculators.Add(name,calculator);
            _valueFunctions.Add(name,valueFunction);
            return this;
        }

        public TotalCalculatorBuilder<TSourceData, TTableData> AddTotalFormat<TTableColumn, TTotalType>(
            Expression<Func<TTableData, TTableColumn>> column,
            Func<PowerTablesData<TSourceData, TTableData>, TTotalType> calculator,
            string format
            )
        {
            format = format.Replace("{", "\" + ").Replace("}"," + \"");

            format = String.Concat("function (v) { return \"", format, "\";}");
            
            return AddTotal(column, calculator, format);
        }

    }
}
