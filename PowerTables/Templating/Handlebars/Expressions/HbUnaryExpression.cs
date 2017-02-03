using System;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbUnaryExpression : HbExpression
    {
        public HbExpression Expression { get; set; }
        public string Symbol { get; set; }
        public override string Build()
        {
            return String.Format("({0}{1})",Symbol,Expression.Build());
        }
    }
}
