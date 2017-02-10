using System;

namespace PowerTables.Templating.Expressions.Visiting
{
    class JsUnaryExpression : JsExpression
    {
        public JsExpression Expression { get; set; }
        public string Symbol { get; set; }
        public override string Build()
        {
            return String.Format("({0}{1})",Symbol,Expression.Build());
        }
    }
}
