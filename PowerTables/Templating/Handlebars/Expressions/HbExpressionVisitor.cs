﻿using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text;

namespace PowerTables.Templating.Handlebars.Expressions
{
    class HbExpressionVisitor : ExpressionVisitor
    {
        private readonly Stack<HbExpression> _resultsStack = new Stack<HbExpression>();
        private readonly List<HbUnboundExpression> _unboundModelReferences = new List<HbUnboundExpression>();

        public List<HbUnboundExpression> UnboundModelReferences
        {
            get { return _unboundModelReferences; }
        }

        public void BindModel(string modelLiteral)
        {
            foreach (var unboundModelReference in _unboundModelReferences)
            {
                unboundModelReference.Boundee = new HbLiteralExpression() { Literal = modelLiteral };
            }
        }

        public void Bind(HbExpression expression)
        {
            foreach (var unboundModelReference in _unboundModelReferences)
            {
                unboundModelReference.Boundee = expression;
            }
        }

        public void BindEmpty()
        {
            foreach (var unboundModelReference in _unboundModelReferences)
            {
                unboundModelReference.IsEmpty = true;
            }
        }

        protected override Expression VisitConditional(ConditionalExpression node)
        {
            var result = new HbTernaryExpression();
            Visit(node.Test);
            result.Condition = Retrieve();
            Visit(node.IfTrue);
            result.IfTrue = Retrieve();
            Visit(node.IfFalse);
            result.IfFalse = Retrieve();
            Return(result);
            return node;
        }


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
            if (node.Expression.Type.IsDefined(typeof(CompilerGeneratedAttribute), false))
            {
                var fi = (FieldInfo)node.Member;
                var constant = node.Expression as ConstantExpression;
                if (constant != null)
                {
                    var inst = constant.Value;
                    var val = fi.GetValue(inst);
                    Return(WrapConstant(val,fi.FieldType));
                    return node;
                }
            }

            var memberName = node.Member.Name;

            var attr = node.Member.GetCustomAttribute<OverrideTplFieldNameAttribute>();
            if (attr != null)
            {
                memberName = attr.Name;
            }
            
            Visit(node.Expression);
            var accessedExpression = Retrieve();
            if (node.Member.Name == "Length")
            {
                if (node.Expression.Type.IsArray)
                {
                    memberName = "length";
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
            var customAttr = node.Method.GetCustomAttribute<CustomMethodCallTranslationAttribute>();
            if (customAttr != null)
            {
                var result = customAttr.TranslationFunction.Invoke(null, new object[] { node, this });
                Return((HbExpression)result);
                return node;
            }
            
            Visit(node.Object);
            HbMemberExpression callee = new HbMemberExpression() { Accessed = Retrieve(), MemberName = node.Method.Name };

            if (node.Method.Name == "get_Item")
            {
                Visit(node.Arguments[0]);
                var arg = Retrieve();
                var idx = new HbIndexerExpression()
                {
                    ExpressionToIndex = callee.Accessed,
                    Index = arg
                };
                Return(idx);
                return node;
            }
            var methodCall = new HbCallExpression { ExpressionToCall = callee };
            foreach (var expression in node.Arguments)
            {
                Visit(expression);
                var arg = Retrieve();
                methodCall.Arguments.Add(arg);
            }
            Return(methodCall);
            return node;
        }

        protected override Expression VisitUnary(UnaryExpression node)
        {
            Visit(node.Operand);
            var operand = Retrieve();
            if (node.NodeType == ExpressionType.ArrayLength)
            {
                Return(new HbMemberExpression() { Accessed = operand, MemberName = "length" });
                return node;
            }
            var sym = GetNodeSymbol(node.NodeType);
            Return(new HbUnaryExpression { Expression = operand, Symbol = sym });
            return node;
        }

        protected override Expression VisitBinary(BinaryExpression node)
        {
            Visit(node.Left);
            var left = Retrieve();
            Visit(node.Right);
            var right = Retrieve();
            string symbol = GetNodeSymbol(node.NodeType);
            Return(new HbBinaryExpression { Left = left, Right = right, Symbol = symbol });
            return node;
        }


        private string GetNodeSymbol(ExpressionType type)
        {
            switch (type)
            {
                case ExpressionType.Add: return "+";
                case ExpressionType.Subtract: return "-";
                case ExpressionType.Divide: return "/";
                case ExpressionType.Multiply: return "*";
                case ExpressionType.AddAssign: return "+=";
                case ExpressionType.SubtractAssign: return "-=";
                case ExpressionType.DivideAssign: return "/=";
                case ExpressionType.MultiplyAssign: return "*=";
                case ExpressionType.And: return "&";
                case ExpressionType.AndAlso: return "&&";
                case ExpressionType.AndAssign: return "&=";
                case ExpressionType.Or: return "|";
                case ExpressionType.OrElse: return "||";
                case ExpressionType.OrAssign: return "|=";
                case ExpressionType.Not: return "!";
                case ExpressionType.Equal: return "==";
                case ExpressionType.NotEqual: return "!=";
                case ExpressionType.Negate: return "-";
                case ExpressionType.UnaryPlus: return "+";
                case ExpressionType.Assign: return "=";
                case ExpressionType.GreaterThan: return ">";
                case ExpressionType.LessThan: return "<";
                case ExpressionType.LessThanOrEqual: return "<=";
                case ExpressionType.GreaterThanOrEqual: return ">=";
                case ExpressionType.Coalesce: return "||";
                default:
                    throw new Exception("Invalid expression type");
            }
        }
        protected override Expression VisitParameter(ParameterExpression node)
        {
            var ngex = new HbUnboundExpression();
            _unboundModelReferences.Add(ngex);
            Return(ngex);
            return base.VisitParameter(node);
        }

        protected override Expression VisitConstant(ConstantExpression node)
        {
            Return(WrapConstant(node.Value, node.Type));
            return node;
        }

        private HbLiteralExpression WrapConstant(object value,Type type)
        {
            if (value == null)
            {
                return new HbLiteralExpression { Literal = "null" };
            }
            if (type == typeof(string))
            {
                var s = "\'" + value.ToString().Replace("\"", "\\\"") + "\'";
                return new HbLiteralExpression { Literal = s };
            }

            if (type == typeof(bool))
            {
                var b = (bool)value;
                return new HbLiteralExpression { Literal = b ? "true" : "false" };
            }
            return new HbLiteralExpression {Literal = value.ToString()};
        }
    }
}
