using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using PowerTables.Templating.Expressions.Visiting;

namespace PowerTables.Templating.Expressions
{
    /// <summary>
    /// Set of extension methods to interact with handlebars.js
    /// </summary>
    public static class JsExtensions
    {
        public static string TraversePropertyLambda(LambdaExpression lambda, params string[] existing)
        {
            if (existing == null || existing.Length == 0 || existing[0] == null)
            {
                existing = new[] { "o" };
            }
            var visitor = new JsExpressionVisitor();
            visitor.VisitAll(lambda);
            visitor.Bind(existing);
            var ex = visitor.Retrieve();
            var expr = ex.Build();
            return expr;
        }
        /// <summary>
        /// This-field helper
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns>{{else}} keyword</returns>
        public static SpecialString This<T>(this IModelProvider<T> t)
        {
            return t._("w(o);");
        }

        #region IfElse

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static CodeBlock If<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition)
        {
            var expr = TraversePropertyLambda(condition, t.ExistingModel);
            return new CodeBlock(string.Format("if({0}){{", expr), "}", t);
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <param name="textIf">Text if condition met</param>
        /// <returns></returns>
        public static SpecialString If<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition, string textIf)
        {
            var expr = TraversePropertyLambda(condition, t.ExistingModel);
            return t._("if({0}){{{1}}}", expr, RawExtensions.Prettify(textIf));
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition">Comparison condition. Use "o" as current viewmodel</param>
        /// <param name="textIf">Text if condition met</param>
        /// <returns></returns>
        public static SpecialString If<T>(this IModelProvider<T> t, string condition, string textIf)
        {
            return t._("if({0}){{{1}}}", condition, RawExtensions.Prettify(textIf));
        }

        /// <summary>
        /// Else helper
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns>{{else}} keyword</returns>
        public static SpecialString Else<T>(this IModelProvider<T> t)
        {
            return t._("}else{");
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition"></param>
        /// <returns></returns>
        public static CodeBlock ElseIf<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition)
        {
            var expr = TraversePropertyLambda(condition, t.ExistingModel);
            return new CodeBlock(string.Format("}}else if({0}){{", expr), null, t);
        }

        #endregion

        #region Each
        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns></returns>
        public static ParametrizedCodeBlock<int> For<T>(this IModelProvider<T> t, Expression<Func<T, int, bool>> condition,
            Expression<Func<T, int>> start = null,
            Expression<Action<T, int>> increment = null)
        {
            var iterator = t.Iterator();

            var condJs = TraversePropertyLambda(condition, new[] { t.ExistingModel, iterator });
            var startJs = "0";
            if (start != null)
            {
                startJs = TraversePropertyLambda(start, new[] { t.ExistingModel });
            }
            var incrJs = iterator + "++";
            if (increment != null)
            {
                incrJs = TraversePropertyLambda(increment, new[] { t.ExistingModel, iterator });
            }

            var heading = string.Format("for(var {0}={1};{2};{3}){{ ", iterator, startJs, condJs, incrJs);
            return new ParametrizedCodeBlock<int>(heading, "}", t, iterator);
        }

        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        public static ParametrizedCodeBlock<IJsObject> In<T>(this IModelProvider<T> t, Expression<Func<T, object>> collection)
        {
            var proname = TraversePropertyLambda(collection, t.ExistingModel);
            var k = t.Key();
            var v = t.Variable();
            var heading = string.Format("for(var {1} in {0}){{var {2}={0}[{1}];", proname, k, v);
            return new ParametrizedCodeBlock<IJsObject>(heading, "}", t, v);
        }

        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TElement"></typeparam>
        /// <param name="t"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        public static ParametrizedCodeBlock<TElement> Each<T, TElement>(this IModelProvider<T> t, Expression<Func<T, IEnumerable<TElement>>> collection)
        {
            var proname = TraversePropertyLambda(collection, t.ExistingModel);
            var i = t.Iterator();
            var v = t.Variable();
            var heading = string.Format("for(var {1}=0;{1}<{0}.length;{1}++){{var {2}={0}[{1}];", proname, i, v);
            return new ParametrizedCodeBlock<TElement>(heading, "}", t, v);
        }

        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        public static ParametrizedCodeBlock<TElement> Each<T, TElement>(this IModelProvider<T> t, Expression<Func<T, IJsArray<TElement>>> collection)
        {
            var proname = TraversePropertyLambda(collection, t.ExistingModel);
            var i = t.Iterator();
            var v = t.Variable();
            var heading = string.Format("for(var {1}=0;{1}<{0}.length;{1}++){{var {2}={0}[{1}];", proname, i, v);
            return new ParametrizedCodeBlock<TElement>(heading, "}", t, v);
        }

        #endregion

        #region Value output

        /// <summary>
        /// Outputs placeholder for handlebars value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static SpecialString Value<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
        {
            return t._("w({0});", Property(t, valueField));
        }

        /// <summary>
        /// Outputs placeholder for handlebars value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static SpecialString Value<T>(this IModelProvider<T> t, string valueField)
        {
            return t._("w({0});", valueField);
        }

        /// <summary>
        /// Returns clean value expression without HB parenthesis
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static string Property<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
        {
            var proname = TraversePropertyLambda(valueField, t.ExistingModel);
            return proname;
        }

        /// <summary>
        /// Outputs placeholder for handlebars value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static SpecialString HtmlValue<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
        {
            var proname = TraversePropertyLambda(valueField, t.ExistingModel);
            return t._("w({0});", proname);
        }

        /// <summary>
        /// Outputs placeholder for handlebars value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t"></param>
        /// <param name="valueField">Value expression</param>
        /// <returns></returns>
        public static SpecialString HtmlValue<T, TData>(this IModelProvider<T> t, string valueField)
        {
            return t._("w({0});", valueField);
        }

        #endregion

        /// <summary>
        /// Binds event at specified element
        /// </summary>
        /// <param name="t">Template region</param>
        /// <param name="commaSeparatedFunction">Comma-separated functions list to be bound</param>
        /// <param name="commaSeparatedEvents">Comma-separated events list to be bound</param>
        /// <param name="eventArguments">Event arguments</param>
        /// <returns></returns>
        public static SpecialString BindEvent<T, TModel, TData>(this T t, string commaSeparatedFunction, string commaSeparatedEvents,
            params Expression<Func<TModel, TData>>[] eventArguments)
            where T : IProvidesEventsBinding, IModelProvider<TModel>
        {
            var args = eventArguments.Select(c => TraversePropertyLambda(c, t.ExistingModel)).ToArray();
            return t.BindEvent(commaSeparatedFunction, commaSeparatedEvents, args);
        }
    }
}
