using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.CellTemplating
{
    public class TemplateDataWrapper<T>
    {
        public TemplateDataWrapper(CellTemplateBuilder template)
        {
            Template = template;
        }

        public CellTemplateBuilder Template { get; private set; }

        public string Data { get { return "{@}"; } }

        public string this[Expression<Func<T, object>> exp]
        {
            get
            {
                return Traverse(exp.Body);
            }
        }


        private string Traverse(Expression mex)
        {
            var initial = mex;
            Queue<string> qs = new Queue<string>();
            while (mex != null)
            {
                if (mex is MemberExpression)
                {
                    var e = mex as MemberExpression;
                    qs.Enqueue(e.Member.Name);
                    mex = e.Expression;
                    continue;
                }

                if (mex.NodeType == ExpressionType.Convert)
                {
                    var e = mex as UnaryExpression;
                    mex = e.Operand;
                    continue;
                }
                if (mex.NodeType == ExpressionType.Parameter) break;
                throw new Exception(string.Format("Unrecognized templating expression {0}", initial));
            }

            var result = string.Empty;
            result = qs.Count == 1 ? qs.Dequeue() : string.Join(".", qs);

            return "{" + result + "}";
        }

    }
}
