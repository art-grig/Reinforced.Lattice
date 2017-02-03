using System;
using System.Collections.Generic;
using System.Linq;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbCallExpression : HbExpression
    {
        public HbExpression ExpressionToCall { get; set; }

        public List<HbExpression> Arguments { get; set; }

        public HbCallExpression()
        {
            Arguments = new List<HbExpression>();
        }

        public override string Build()
        {
            return String.Format("{0}({1})", ExpressionToCall.Build(),
                string.Join(",", Arguments.Select(c => c.Build())));
        }
    }
}
