using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbIndexerExpression : HbExpression
    {
        public HbExpression ExpressionToIndex { get; set; }

        public HbExpression Index { get; set; }
        public override string Build()
        {
            return string.Format("{0}[{1}]", ExpressionToIndex.Build(), Index.Build());
        }
    }
}
