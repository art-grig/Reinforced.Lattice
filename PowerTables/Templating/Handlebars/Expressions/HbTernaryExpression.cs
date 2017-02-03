using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbTernaryExpression : HbExpression
    {
        public HbExpression Condition { get; set; }

        public HbExpression IfTrue { get; set; }

        public HbExpression IfFalse { get; set; }

        public override string Build()
        {
            return string.Format("(({0})?({1}):({2}))", Condition.Build(), IfTrue.Build(), IfFalse.Build());
        }
    }
}
