using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;


namespace PowerTables
{
    /// <summary>
    /// Set of helper reflection methods
    /// </summary>
    public static class LambdaHelpers
    {
        //public static MethodInfo OrderByMethod = typeof (Queryable)
        //    .GetMethod("OrderBy");

        /// <summary>
        /// Parses supplied lambda expression and retrieves PropertyInfo from it
        /// </summary>
        /// <param name="lambda">Property Lambda expression</param>
        /// <returns>PropertyInfo referenced by this expression</returns>
        public static PropertyInfo ParsePropertyLambda(LambdaExpression lambda)
        {
            var mex = lambda.Body as MemberExpression;
            if (mex == null) throw new Exception("Here should be property");
            var pi = mex.Member as PropertyInfo;
            if (pi == null) throw new Exception("Here should be property");
            return pi;
        }

        /// <summary>
        /// Parses supplied lambda expression and retrieves PropertyInfo from it
        /// </summary>
        /// <param name="lambda">Property Lambda expression</param>
        /// <returns>PropertyInfo referenced by this expression</returns>
        public static PropertyInfo ParsePropertyExpression(Expression expr)
        {
            var mex = expr as MemberExpression;
            if (mex == null) throw new Exception("Here should be property");
            var pi = mex.Member as PropertyInfo;
            if (pi == null) throw new Exception("Here should be property");
            return pi;
        }

        public static string[] ExtractColumnsList(LambdaExpression keyExpression)
        {
            if (keyExpression.Body.NodeType == ExpressionType.MemberAccess)
            {
                var parse = LambdaHelpers.ParsePropertyLambda(keyExpression);
                return new string[] { parse.Name };
            }
            if (keyExpression.Body.NodeType == ExpressionType.New)
            {
                var expr = (NewExpression)keyExpression.Body;
                List<string> parameterNames = new List<string>();
                if (expr.Arguments.Count == 0) throw new Exception("Columns list cannot be empty");
                foreach (var exprArgument in expr.Arguments)
                {
                    var p = LambdaHelpers.ParsePropertyExpression(exprArgument);
                    parameterNames.Add(p.Name);
                }
                return parameterNames.ToArray();
            }
            throw new Exception(string.Format("Unknown columns list expression {0}", keyExpression));
        }

        /// <summary>
        /// Parses supplied lambda expression and retrieves PropertyInfo from it
        /// </summary>
        /// <typeparam name="T1">T1</typeparam>
        /// <typeparam name="T2">T2</typeparam>
        /// <param name="lambda">Property Lambda expression</param>
        /// <returns>PropertyInfo referenced by this expression</returns>
        public static PropertyInfo ParsePropertyLambda<T1, T2>(Expression<Func<T1, T2>> lambda)
        {
            var mex = lambda.Body as MemberExpression;
            if (mex == null) throw new Exception("Here should be property");
            var pi = mex.Member as PropertyInfo;
            if (pi == null) throw new Exception("Here should be property");
            return pi;
        }

        /// <summary>
        /// Dynamically constructs lambda member expression using string property name (c=>c.Property)
        /// </summary>
        /// <typeparam name="T">T</typeparam>
        /// <param name="propertyName">Property name (should belong to T)</param>
        /// <returns>Lambda expression denoting c=>c.Property</returns>
        public static Expression MemberExpression<T>(string propertyName)
        {
            var t = typeof(T).GetProperty(propertyName);
            var param = Expression.Parameter(t.DeclaringType);
            var mex = Expression.Property(param, t);
            var lmbd = Expression.Lambda(mex, param);
            return lmbd;
        }

        /// <summary>
        /// Dynamically constructs lambda member expression using specified type property (c=>c.Property)
        /// </summary>
        /// <param name="property">Property</param>
        /// <returns>Lambda expression denoting c=>c.Property</returns>
        public static Expression MemberExpression(PropertyInfo property)
        {
            var param = Expression.Parameter(property.DeclaringType);
            var mex = Expression.Property(param, property);
            var lmbd = Expression.Lambda(mex, param);
            return lmbd;
        }


        /// <summary>
        /// Dynamically constructs lambda equals expression (c=>c.Property == val)
        /// </summary>
        /// <param name="expressionType">Expression type (equal, less, more etc)</param>
        /// <param name="property">Property</param>
        /// <param name="value">Constant value</param>
        /// <returns>Lambda expression denoting c=>c.Property</returns>
        public static LambdaExpression BinaryLambdaExpression(ExpressionType expressionType, PropertyInfo property, object value)
        {
            ConstantExpression cex = Expression.Constant(value);
            ParameterExpression pex = Expression.Parameter(property.DeclaringType);
            MemberExpression mex = Expression.Property(pex, property);
            if (property.PropertyType.IsNullable())
            {
                var val = property.PropertyType.GetProperty("Value");
                mex = Expression.Property(mex, val);
            }
            BinaryExpression bex = Expression.MakeBinary(expressionType, mex, cex);
            LambdaExpression lambda = Expression.Lambda(bex, pex);

            return lambda;
        }

        /// <summary>
        /// Dynamically constructs lambda equals expression (c=>c.Property == val)
        /// </summary>
        /// <param name="expressionType">Expression type (equal, less, more etc)</param>
        /// <param name="filterExpression">Filter expression</param>
        /// <param name="value">Constant value</param>
        /// <returns>Lambda expression denoting c=>c.Property</returns>
        public static LambdaExpression ConstantBinaryLambdaExpression(ExpressionType expressionType, LambdaExpression filterExpression, object value)
        {
            Expression cex = Expression.Constant(value);
            if (filterExpression.Body.Type.IsNullable())
            {
                cex = Expression.Convert(cex, filterExpression.Body.Type);
            }
            BinaryExpression bex = Expression.MakeBinary(expressionType, filterExpression.Body, cex);
            LambdaExpression lambda = Expression.Lambda(bex, filterExpression.Parameters);
            return lambda;
        }

        /// <summary>
        /// Dynamically constructs lambda equals expression (c=>c.Property == val)
        /// </summary>
        /// <param name="expressionType">Expression type (equal, less, more etc)</param>
        /// <param name="left">Left expression part</param>
        /// <param name="right">Right expression part</param>
        /// <returns>Lambda expression denoting c=>c.Property</returns>
        public static LambdaExpression BinaryLambdaExpression(ExpressionType expressionType, LambdaExpression left, LambdaExpression right)
        {
            BinaryExpression bex = Expression.MakeBinary(expressionType, left.Body, right.Body);
            LambdaExpression lambda = Expression.Lambda(bex, left.Parameters);
            return lambda;
        }

        /// <summary>
        /// Dynamically constructs lambda between expression (c=> (c.Property &gt;= val) && (c.Property &lt;= val))
        /// </summary>
        /// <param name="property">Property</param>
        /// <param name="from">Minimum</param>
        /// <param name="to">Maximum</param>
        /// <param name="inclusive">Include min/max values to resulting set or not</param>
        /// <returns>Lambda expression denoting c=>c.Property</returns>
        public static LambdaExpression BetweenLambdaExpression(PropertyInfo property, object from, object to, bool inclusive = false)
        {
            Expression cfrom = Expression.Constant(@from);
            Expression cto = Expression.Constant(to);

            if (property.PropertyType.IsNullable())
            {
                cfrom = Expression.Convert(cfrom, property.PropertyType);
                cto = Expression.Convert(cto, property.PropertyType);
            }

            ParameterExpression pex = Expression.Parameter(property.DeclaringType);
            MemberExpression mex = Expression.Property(pex, property);

            ExpressionType gt = inclusive ? ExpressionType.GreaterThanOrEqual : ExpressionType.GreaterThan;
            ExpressionType lt = inclusive ? ExpressionType.LessThanOrEqual : ExpressionType.LessThan;

            BinaryExpression left = Expression.MakeBinary(gt, mex, cfrom);
            BinaryExpression right = Expression.MakeBinary(lt, mex, cto);

            BinaryExpression and = Expression.And(left, right);

            LambdaExpression lambda = Expression.Lambda(and, pex);

            return lambda;
        }

        /// <summary>
        /// Dynamically constructs lambda between expression (c=> (c.Property &gt; = val) && (c.Property &lt;= val))
        /// </summary>
        /// <param name="filterExpression">Filter expression</param>
        /// <param name="from">Minimum</param>
        /// <param name="to">Maximum</param>
        /// <param name="inclusive">Include min/max values to resulting set or not</param>
        /// <returns>Lambda expression denoting c=>c.Property</returns>
        public static LambdaExpression BetweenLambdaExpression(LambdaExpression filterExpression, object from, object to, bool inclusive = false)
        {
            Expression cfrom = Expression.Constant(@from);
            Expression cto = Expression.Constant(to);

            if (filterExpression.Body.Type.IsNullable())
            {
                cfrom = Expression.Convert(cfrom, filterExpression.Body.Type);
                cto = Expression.Convert(cto, filterExpression.Body.Type);
            }

            ExpressionType gt = inclusive ? ExpressionType.GreaterThanOrEqual : ExpressionType.GreaterThan;
            ExpressionType lt = inclusive ? ExpressionType.LessThanOrEqual : ExpressionType.LessThan;

            BinaryExpression left = Expression.MakeBinary(gt, filterExpression.Body, cfrom);
            BinaryExpression right = Expression.MakeBinary(lt, filterExpression.Body, cto);

            BinaryExpression and = Expression.And(left, right);

            LambdaExpression lambda = Expression.Lambda(and, filterExpression.Parameters);
            return lambda;
        }
    }
}
