using System;

namespace PowerTables.Templating.Expressions.Visiting
{
    class JsBinaryExpression : JsExpression
    {
        public JsExpression Left { get; set; }

        public JsExpression Right { get; set; }

        public string Symbol { get; set; }
        public override string Build()
        {
            return String.Format("({1} {0} {2})", Symbol, Left.Build(), Right.Build());
        }
    }
}
