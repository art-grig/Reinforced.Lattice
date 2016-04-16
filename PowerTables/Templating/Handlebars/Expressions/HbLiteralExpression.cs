using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbLiteralExpression : HbExpression
    {
        public string Literal { get; set; }

        public override string Build()
        {
            return Literal;
        }
    }
}
