using System;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbBinaryExpression : HbExpression
    {
        public HbExpression Left { get; set; }

        public HbExpression Right { get; set; }

        public string Symbol { get; set; }
        public override string Build()
        {
            return String.Format("({1} {0} {2})", Symbol, Left.Build(), Right.Build());
        }
    }
}
