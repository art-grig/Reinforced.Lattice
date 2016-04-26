using System;
using System.Linq.Expressions;
using System.Text;
using PowerTables.CellTemplating;

namespace PowerTables.Plugins.Total
{
    /// <summary>
    /// Describes type of client data set to perform client calculations on
    /// </summary>
    public enum ClientDataSet
    {
        /// <summary>
        /// Source data, received from server side, unmodified
        /// </summary>
        Source,
        /// <summary>
        /// Filtered server data according to client filters settings
        /// </summary>
        Filtered,
        /// <summary>
        /// Ordered filtered server data according to client ordering and filter settings
        /// </summary>
        Ordered,

        /// <summary>
        /// Data that is being actually displayed in table, filtered, ordered and truncated according to pagination settings
        /// </summary>
        Displaying
    }

    /// <summary>
    /// Set of built-in client function extensions
    /// </summary>
    public static class TotalClientFunctionsExtensions
    {
        private static string CreateSumFunction(string sumExpression, ClientDataSet dataSet)
        {
            StringBuilder sb = new StringBuilder("function(v){var s=0;");
            sb.AppendFormat("for(var i=0;i<v.{0}.length;i++){{", dataSet);
            var compiledExpr = Template.CompileExpression(sumExpression, "v", string.Format("{0}[i]", dataSet));
            sb.AppendFormat("if ((({0})!=null)&&(({0})!=undefined)) s+=({0});}}return s;}}", compiledExpr);
            return sb.ToString();
        }

        private static string CreateSumFunctionWithPredicate(string sumExpression, string predicateExpression, ClientDataSet dataSet)
        {
            StringBuilder sb = new StringBuilder("function(v){var s=0;");
            sb.AppendFormat("for(var i=0;i<v.{0}.length;i++){{", dataSet);
            var compiledExpr = Template.CompileExpression(sumExpression, "v", string.Format("{0}[i]", dataSet));
            var compiledPredicate = Template.CompileExpression(predicateExpression, string.Format("v.{0}[i]", dataSet), string.Empty);
            sb.AppendFormat("if ((({0})!=null)&&(({0})!=undefined)) s+=(({1})?({0}):0);}}return s;}}", compiledExpr, compiledPredicate);
            return sb.ToString();
        }

        private static string CreateWeightedAvgFunction(string avgExpression, string weightExpression, ClientDataSet dataSet)
        {
            StringBuilder sb = new StringBuilder("function(v){var s=0,w=0;");
            sb.AppendFormat("for(var i=0;i<v.{0}.length;i++){{", dataSet);
            var compiledExpr = Template.CompileExpression(avgExpression, "v", string.Format("{0}[i]", dataSet));
            var compiledAvg = Template.CompileExpression(weightExpression, "v", string.Format("{0}[i]", dataSet));
            sb.AppendFormat("if ((({0})!=null)&&(({0})!=undefined)&&(({1})!=null)&&(({1})!=undefined)) {{s+=(({0})*({1}));w+=({1});}}}}return ((w==0)?0:(s/w));}}", compiledExpr, compiledAvg);
            return sb.ToString();
        }

        private static string CreateAvgFunction(string avgExpression, ClientDataSet dataSet)
        {
            StringBuilder sb = new StringBuilder("function(v){var s=0;");
            sb.AppendFormat("for(var i=0;i<v.{0}.length;i++){{", dataSet);
            var compiledExpr = Template.CompileExpression(avgExpression, "v", string.Format("{0}[i]", dataSet));
            sb.AppendFormat("if ((({0})!=null)&&(({0})!=undefined)) s+=(({0}));}}return ((v.{1}.length==0)?0:(s/(v.{1}.length)));}}", compiledExpr, dataSet);
            return sb.ToString();
        }

        private static string CreateExtremumFunction(string expression, bool isMax, ClientDataSet dataSet)
        {
            StringBuilder sb = new StringBuilder("function(v){var r=");
            if (isMax) sb.Append("(0-Infinity);");
            else sb.Append("Infinity;");
            sb.AppendFormat("for(var i=0;i<v.{0}.length;i++){{", dataSet);
            var compiledExpr = Template.CompileExpression(expression, "v", string.Format("{0}[i]", dataSet));
            sb.AppendFormat("if ((({0})!=null)&&(({0})!=undefined)) r=(({0}){1}r?({0}):r);}}return r;}}", compiledExpr, isMax ? ">" : "<");
            return sb.ToString();
        }

        /// <summary>
        /// Adds client total calculator that produces sum amount of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="sumExpression">`{@}`-syntax expression that will be calculated for each row and summarized</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientSum<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            string sumExpression,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = CreateSumFunction(sumExpression, clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces sum amount of supplied row values that match supplied predicate function
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="sumExpression">`{@}`-syntax expression that will be calculated for each row and summarized</param>
        /// <param name="predicate">`{@}`-syntax expression that specifies predicate</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientSumPredicate<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            string sumExpression,
            string predicate,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = CreateSumFunctionWithPredicate(sumExpression, predicate, clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces count of rows
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientCount<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = string.Format("function(v){{ return v.{0}.length; }}", clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces count of rows that match supplied predicate function
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="predicate">`{@}`-syntax expression that specifies predicate</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientCountPredicate<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            string predicate,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = CreateSumFunctionWithPredicate("1", predicate, clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }


        /// <summary>
        /// Adds client total calculator that produces average of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="avgExpression">`{@}`-syntax expression that will be calculated for each row and averaged</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientAverage<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            string avgExpression,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = CreateAvgFunction(avgExpression, clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }


        /// <summary>
        /// Adds client total calculator that produces weighted average of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="avgExpression">`{@}`-syntax expression that will be calculated for each row and averaged</param>
        /// <param name="weightExpression">`{@}`-syntax expression for weight coefficient</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientWeightedAverage<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            string avgExpression,
            string weightExpression,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = CreateWeightedAvgFunction(avgExpression, weightExpression, clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces minimum of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="expression">`{@}`-syntax expression minimum of which will be found</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientMin<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            string expression,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = CreateExtremumFunction(expression, false, clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }

        /// <summary>
        /// Adds client total calculator that produces maximum of supplied row values
        /// </summary>
        /// <param name="conf">Configuration</param>
        /// <param name="column">Table column to provide total with</param>
        /// <param name="expression">`{@}`-syntax expression minimum of which will be found</param>
        /// <param name="clientDataSet">Client data set to perform calculations on</param>
        /// <param name="template">Tempalte for total cell</param>
        /// <returns></returns>
        public static TotalCalculatorBuilder<TSourceData, TTableData> AddClientMax<TSourceData, TTableData, TTableColumn>(
            this TotalCalculatorBuilder<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            string expression,
            ClientDataSet clientDataSet,
            Action<CellTemplateBuilder> template = null
            ) where TTableData : new()
        {
            var name = LambdaHelpers.ParsePropertyLambda(column).Name;
            var function = CreateExtremumFunction(expression, true, clientDataSet);
            conf.ClientCalculators.Add(name, function);
            if (template != null)
            {
                conf.AddTemplate(column, template);
            }
            return conf;
        }
    }
}
