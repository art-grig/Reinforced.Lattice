using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;

namespace PowerTables.Plugins.Ordering
{
    /// <summary>
    /// Configuration builder for client-side ordering
    /// </summary>
    public class OrderingUiConfigurationBuilder
    {
        private readonly OrderingConfiguration _configuration;
        private readonly string _columnName;

        /// <summary>
        /// Specifies default ordering direction for particular column
        /// </summary>
        /// <param name="ordering">Default ordering direction</param>
        /// <returns>Fluent</returns>
        public OrderingUiConfigurationBuilder DefaultOrdering(
            PowerTables.Ordering ordering = PowerTables.Ordering.Neutral)
        {
            _configuration.DefaultOrderingsForColumns[_columnName] = ordering;
            return this;
        }
        /// <summary>
        /// Instructs plugin to use client ordering for this column
        /// </summary>
        /// <param name="orderingFunction">Optional ordering function override. Can be specified in form of "function(a,b) { return 0/1/-1; }" 
        /// or custom client function name. Function must consume 2 arguments of type JSON-ed table data and return 1 if a is greater than b, 
        /// -1 if a is less than b and 0 if a and b are equal. 
        /// </param>
        /// <returns></returns>
        public OrderingUiConfigurationBuilder UseClientOrdering(string orderingFunction = null)
        {
            JRaw fn = new JRaw(string.IsNullOrEmpty(orderingFunction) ? "null" : orderingFunction);
            _configuration.ClientSortableColumns[_columnName] = fn;
            return this;
        }

        /// <summary>
        /// Instructs plugin to use client ordering for this column consuming filtering expression. 
        /// Use it as LINQ ordering expression. `{}`-syntax supported. Be careful of nulls
        /// </summary>
        /// <param name="expression">Ordering expression</param>
        /// <returns></returns>
        public OrderingUiConfigurationBuilder UseClientOrderingNumericExpression(string expression)
        {
            var exprLeft = Template.CompileExpression(expression, "x", null, _columnName);
            var exprRight = Template.CompileExpression(expression, "y", null, _columnName);
            var fn = string.Format("function(x,y){{ return (({0}) - ({1})); }}", exprLeft, exprRight);
            _configuration.ClientSortableColumns[_columnName] = new JRaw(fn);
            return this;
        }

        internal OrderingUiConfigurationBuilder(PluginConfigurationWrapper<OrderingConfiguration> configuration, string columnName)
        {
            _configuration = configuration.Configuration;
            _columnName = columnName;
            _configuration.DefaultOrderingsForColumns[_columnName] = PowerTables.Ordering.Neutral;
        }
    }
}
