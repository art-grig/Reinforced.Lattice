using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Plugins.Total
{
    /// <summary>
    /// Builder for server table subtotals calculators
    /// </summary>
    public class TotalCalculatorBuilder<TSourceData, TTableData> where TTableData : new()
    {
        
        private readonly Dictionary<string, Delegate> _calculators = new Dictionary<string, Delegate>();
        private readonly Dictionary<string, string> _valueFunctions = new Dictionary<string, string>();

        /// <summary>
        /// All calculators (delegates). Key = column, Value = calculation delegate
        /// </summary>
        public IReadOnlyDictionary<string, Delegate> Calculators { get { return _calculators; } }

        /// <summary>
        /// Value formatting functions for table total
        /// </summary>
        public IReadOnlyDictionary<string, string> ValueFunctions { get { return _valueFunctions; } }

        /// <summary>
        /// Adds total calculator to table
        /// </summary>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="calculator">Total calculator consuming ready-to-send table data and producing some value</param>
        /// <param name="valueFunction">Function that will be used to format total in the table. 
        /// Function type is (v:any) => string
        /// v: value that you have calculated previously
        /// </param>
        /// <returns></returns>
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

        /// <summary>
        /// Adds total calculator to table with shortland format function
        /// </summary>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="calculator">Total calculator consuming ready-to-send table data and producing some value</param>
        /// <param name="format">Format. E.g. {v} %. {v} will be substituted with calculated value</param>
        /// <returns></returns>
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
