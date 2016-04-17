using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Plugins.Total
{
    /// <summary>
    /// Builder for server table subtotals calculators
    /// </summary>
    public class TotalCalculatorBuilder<TSourceData, TTableData> where TTableData : new()
    {
        
        private readonly Dictionary<string, Delegate> _calculators = new Dictionary<string, Delegate>();
        private readonly Dictionary<string, string> _valueFunctions = new Dictionary<string, string>();
        private readonly Dictionary<string, string> _clientCalculators = new Dictionary<string, string>();

        /// <summary>
        /// All calculators (delegates). Key = column, Value = calculation delegate
        /// </summary>
        public IReadOnlyDictionary<string, Delegate> Calculators { get { return _calculators; } }

        /// <summary>
        /// Value formatting functions for table total
        /// </summary>
        public IReadOnlyDictionary<string, string> ValueFunctions { get { return _valueFunctions; } }

        /// <summary>
        /// Client calculator functions
        /// </summary>
        public IReadOnlyDictionary<string, string> ClientCalculators { get { return _clientCalculators; } }

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
        /// Adds total calculator to table
        /// </summary>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="calculator">Total calculator consuming ready-to-send table data and producing some value</param>
        /// <param name="templateBuilder">Template builder like for usual column, but here is only self reference ('{@}') available </param>
        /// <returns></returns>
        public TotalCalculatorBuilder<TSourceData, TTableData> AddTotalTemplate<TTableColumn, TTotalType>(
            Expression<Func<TTableData, TTableColumn>> column,
            Func<PowerTablesData<TSourceData, TTableData>, TTotalType> calculator,
            Action<CellTemplateBuilder> templateBuilder
            )
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            _calculators.Add(name, calculator);
            CellTemplateBuilder ctb = new CellTemplateBuilder(null);
            templateBuilder(ctb);
            _valueFunctions.Add(name, ctb.Build());
            return this;
        }

        /// <summary>
        /// Adds only template for total cell
        /// </summary>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="templateBuilder">Template builder like for usual column, but here is only self reference ('{@}') available </param>
        /// <returns></returns>
        public TotalCalculatorBuilder<TSourceData, TTableData> AddTemplate<TTableColumn, TTotalType>(
            Expression<Func<TTableData, TTableColumn>> column,
            Action<CellTemplateBuilder> templateBuilder
            )
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            CellTemplateBuilder ctb = new CellTemplateBuilder(null);
            templateBuilder(ctb);
            _valueFunctions.Add(name, ctb.Build());
            return this;
        }

        /// <summary>
        /// Adds client total calculator function to totals
        /// Calculator function type: (data:IClientDataResults)=>any
        /// data: data prepared on client side. Consists of 4 collections: Source, Filtered, Ordered, Displaying all of type any[] containing corresponding JSONed TTableData
        /// </summary>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="function">Client calculator function</param>
        /// <returns></returns>
        public TotalCalculatorBuilder<TSourceData, TTableData> AddClientCalculator<TTableColumn, TTotalType>(
            Expression<Func<TTableData, TTableColumn>> column,
            string function
            )
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            _clientCalculators.Add(name, function);
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
