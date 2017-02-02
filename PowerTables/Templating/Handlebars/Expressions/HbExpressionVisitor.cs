using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbExpressionVisitor : ExpressionVisitor
    {
        private readonly Stack<HbExpression> _resultsStack = new Stack<HbExpression>();
        public override Expression Visit(Expression node)
        {
            if (node.NodeType == ExpressionType.Convert)
            {
                UnaryExpression uex = (UnaryExpression)node;
                return base.Visit(uex.Operand);
            }
            return base.Visit(node);

        }

        private void Return(HbExpression expr)
        {
            _resultsStack.Push(expr);
        }

        public HbExpression Retrieve()
        {
            return _resultsStack.Pop();
        }

        protected override Expression VisitMember(MemberExpression node)
        {
            HbExpression accessedExpression = null;


            Visit(node.Expression);

            accessedExpression = Retrieve();
            var memberName = node.Member.Name;
            var attr = node.Member.GetCustomAttribute<OverrideTplFieldNameAttribute>();
            if (attr != null)
            {
                memberName = attr.Name;
            }
            else
            {
                if (node.Member.Name == "Length")
                {
                    if (node.Expression.Type.IsArray)
                    {
                        memberName = "length";
                    }
                }
            }
            Return(new HbMemberExpression { Accessed = accessedExpression, MemberName = memberName });
            return node;
        }
        protected override Expression VisitIndex(IndexExpression node)
        {
            Visit(node.Object);
            var ind = Retrieve();
            Visit(node.Arguments[0]);
            var indexee = Retrieve();
            Return(new HbIndexerExpression { ExpressionToIndex = ind, Index = indexee });
            return node;
        }

        protected override Expression VisitMethodCall(MethodCallExpression node)
        {
            var method = node.Method;
            if (method.IsSpecialName)
            {
                Visit(node.Object);
                var no = Retrieve();
                Visit(node.Arguments[0]);
                var arg = Retrieve();
                Return(new HbMemberExpression() { Accessed = no, MemberName = ((HbLiteralExpression)arg).Literal.Trim('\'') });
            }
            return node;
        }

        protected override Expression VisitConstant(ConstantExpression node)
        {
            if (node.Value == null)
            {
                Return(new HbLiteralExpression { Literal = "null" });
                return node;
            }
            if (node.Type == typeof(string))
            {
                var s = "\'" + node.Value.ToString().Replace("\"", "\\\"") + "\'";
                Return(new HbLiteralExpression { Literal = s });
                return node;
            }

            if (node.Type == typeof(bool))
            {
                var b = (bool)node.Value;
                Return(new HbLiteralExpression { Literal = b ? "true" : "false" });
                return node;
            }
            Return(new HbLiteralExpression { Literal = node.Value.ToString() });
            return node;
        }

        protected override Expression VisitParameter(ParameterExpression node)
        {
            var ngex = new HbParameterExpression(); ;
            Return(ngex);
            return base.VisitParameter(node);
        }
    }
}
