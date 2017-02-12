using System;
using System.Collections.Generic;
using System.Linq;

namespace Reinforced.Lattice.Templating.Expressions.Visiting
{
    class JsCallExpression : JsExpression
    {
        public JsExpression ExpressionToCall { get; set; }

        public List<JsExpression> Arguments { get; set; }

        public JsCallExpression()
        {
            Arguments = new List<JsExpression>();
        }

        public override string Build()
        {
            return String.Format("{0}({1})", ExpressionToCall.Build(),
                string.Join(",", Arguments.Select(c => c.Build())));
        }
    }
}
