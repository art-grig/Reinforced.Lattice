using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Mvc;
using PowerTables.Templating.Handlebars.Expressions;

namespace PowerTables.Templating.Handlebars
{
    /// <summary>
    /// Set of extension methods to interact with handlebars.js
    /// </summary>
    public static class HbExtensions
    {
        public static string TraversePropertyLambda(LambdaExpression lambda, string existing = null)
        {
            var visitor = new HbExpressionVisitor();
            visitor.Visit(lambda.Body);
            visitor.BindModel(string.IsNullOrEmpty(existing) ? "o" : existing);
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
        public static MvcHtmlString This<T>(this IModelProvider<T> t)
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
        public static MvcHtmlString If<T>(this IModelProvider<T> t, Expression<Func<T, bool>> condition, string textIf)
        {
            var expr = TraversePropertyLambda(condition, t.ExistingModel);
            return t._("if({0}){{ {1} }}", expr, RawExtensions.Prettify(textIf));
        }

        /// <summary>
        /// Renders handlebars "if" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="condition">Comparison condition. Use "o" as current viewmodel</param>
        /// <param name="textIf">Text if condition met</param>
        /// <returns></returns>
        public static MvcHtmlString If<T>(this IModelProvider<T> t, string condition, string textIf)
        {
            return t._("if({0}){{{1} }}", condition, RawExtensions.Prettify(textIf));
        }

        /// <summary>
        /// Else helper
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <returns>{{else}} keyword</returns>
        public static MvcHtmlString Else<T>(this IModelProvider<T> t)
        {
            return t._("}else{ ");
        }

        #endregion

        #region Each

        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        public static ParametrizedCodeBlock<TElement> Each<T, TElement>(this IModelProvider<T> t, Expression<Func<T, IEnumerable<TElement>>> collection)
        {
            var proname = TraversePropertyLambda(collection, t.ExistingModel);
            var heading = string.Format("for(var i=0;i<{0}.length;i++){{var e={0}[i];", proname);
            return new ParametrizedCodeBlock<TElement>(heading, "}", t, "e");
        }

        /// <summary>
        /// Renders handlebars "each" directive in region
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="collection"></param>
        /// <returns></returns>
        public static ParametrizedCodeBlock<TElement> Each<T, TElement>(this IModelProvider<T> t, Expression<Func<T, IHbArray<TElement>>> collection)
        {
            var proname = TraversePropertyLambda(collection, t.ExistingModel);
            var heading = string.Format("for(var i=0;i<{0}.length;i++){{var e={0}[i];", proname);
            return new ParametrizedCodeBlock<TElement>(heading, "}", t, "e");
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
        public static MvcHtmlString Value<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
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
        public static MvcHtmlString Value<T>(this IModelProvider<T> t, string valueField)
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
        public static MvcHtmlString HtmlValue<T, TData>(this IModelProvider<T> t, Expression<Func<T, TData>> valueField)
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
        public static MvcHtmlString HtmlValue<T, TData>(this IModelProvider<T> t, string valueField)
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
        public static MvcHtmlString BindEvent<T, TModel, TData>(this T t, string commaSeparatedFunction, string commaSeparatedEvents,
            params Expression<Func<TModel, TData>>[] eventArguments)
            where T : IProvidesEventsBinding, IModelProvider<TModel>
        {
            var args = eventArguments.Select(c => TraversePropertyLambda(c, t.ExistingModel)).ToArray();
            return t.BindEvent(commaSeparatedFunction, commaSeparatedEvents, args);
        }
    }
}
