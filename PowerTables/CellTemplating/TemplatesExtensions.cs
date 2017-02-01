using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web;
using System.Web.WebPages;
using PowerTables.Configuration;

namespace PowerTables.CellTemplating
{
    /// <summary>
    /// Extensions for in-cell templates
    /// </summary>
    public static class TemplatesExtensions
    {
        /// <summary>
        /// Renders configured template in specified column. 
        /// You can use {field} syntax to include specific table column value.
        /// Use `{field} + 10` to embed JS expression inside template. Code in `'s will 
        /// be included to template without chages
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="elementsConf">Cell template builder</param>
        /// <returns>Fluent</returns>
        public static T Template<T>(this T col, Action<CellTemplateBuilder> elementsConf) where T : IColumnConfigurator
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder();
            elementsConf(ctb);
            var fun = ctb.Build();
            col.TemplateFunction(fun);
            return col;
        }

        /// <summary>
        /// Renders configured template in specified column. 
        /// You can use {field} syntax to include specific table column value.
        /// Use `{field} + 10` to embed JS expression inside template. Code in `'s will 
        /// be included to template without chages
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="format">Cell format in `{@}`-form</param>
        /// <returns>Fluent</returns>
        public static T Format<T>(this T col, string format) where T : IColumnConfigurator
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder();
            ctb.Returns(format);
            var fun = ctb.Build();
            col.TemplateFunction(fun);
            return col;
        }

        /// <summary>
        /// Renders configured template in specified column. 
        /// You can use {field} syntax to include specific table column value.
        /// Use `{field} + 10` to embed JS expression inside template. Code in `'s will 
        /// be included to template without chages
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="elementsConf">Cell template builder</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSource, TRow, TColumn> Razor<TSource, TRow, TColumn>(this ColumnUsage<TSource, TRow, TColumn> col, Func<TemplateDataWrapper<TRow>, HelperResult> mvcTemplate) where TRow : new()
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder();
            TemplateDataWrapper<TRow> r = new TemplateDataWrapper<TRow>(ctb);
            var result = mvcTemplate(r);

            ctb.Returns(result);
            var fun = ctb.Build();
            col.TemplateFunction(fun);
            return col;
        }

        /// <summary>
        /// Renders configured template in specified column. 
        /// You can use {field} syntax to include specific table column value.
        /// Use `{field} + 10` to embed JS expression inside template. Code in `'s will 
        /// be included to template without chages
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="mvcTemplate">Razor template</param>
        /// <returns>Fluent</returns>
        public static IColumnTargetProperty<T> Razor<T>(this IColumnTargetProperty<T> col,
            Func<object, HelperResult> mvcTemplate)
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder();
            var result = mvcTemplate(new object());

            ctb.Returns(result);
            var fun = ctb.Build();
            col.TemplateFunction(fun);
            return col;
        }

        /// <summary>
        /// Appends onclick attribute to element (usually button)
        /// </summary>
        /// <param name="b"></param>
        /// <param name="functionCall">Function call onclick. {Something} syntax supported </param>
        /// <returns>Fluent</returns>
        public static Template OnClick(this Template b, string functionCall)
        {
            return b.Attr("onclick", functionCall);
        }

        /// <summary>
        /// Appends target attribute to element (usually link)
        /// </summary>
        /// <param name="b"></param>
        /// <param name="target">Target value </param>
        /// <returns>Fluent</returns>
        public static Template Target(this Template b, string target)
        {
            return b.Attr("target", target);
        }

        /// <summary>
        /// Shortcut for formatting table cell as link for specified column
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="linkFormat">Link format. Use " + v.Something + " or "{Something}" to substitute table value</param>
        /// <param name="textFormat">Link text format. Use " + v.Something + " or "{Something}" to substitute table value</param>
        /// <param name="target">Link target. User "_blank" or something similar.</param>
        /// <returns>Fluent</returns>
        public static T Link<T>(this T col, string linkFormat, string textFormat, string target = null) where T : IColumnConfigurator
        {
            return col.Template(c =>
            {
                c.EmptyIfNotPresent("{" + col.ColumnConfiguration.RawColumnName + "}");
                c.Returns(a => a.Tag("a").Attr("href", linkFormat).Content(textFormat).Attr("target", target));
            });
        }

        /// <summary>
        /// Replaces escaped %XX-symbols used by Lattice with regular symbols. 
        /// This method only affects `,@,{,} symbols
        /// </summary>
        /// <param name="s">Escaped HTML string</param>
        /// <returns></returns>
        public static string TemplateHTMLDecode(this string s)
        {
            return CellTemplating.Template.SanitizeHtmlString(s);
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder Returns(this CellTemplateBuilder x, IHtmlString content)
        {
            return x.Returns(CellTemplating.Template.SanitizeHtmlString(content));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder Razor(this CellTemplateBuilder x, Func<object, HelperResult> content)
        {
            return Returns(x, content(new object()));
        }


        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public static CellTemplateBuilder Returns(this CellTemplateBuilder x, Action<Template> elment)
        {
            return x.Returns(CellTemplating.Template.BuildDelegate(elment));
        }


        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, IHtmlString positiveContent, IHtmlString negativeContent)
        {
            return x.ReturnsIf(expression, CellTemplating.Template.SanitizeHtmlString(positiveContent),
                CellTemplating.Template.SanitizeHtmlString(negativeContent));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, IHtmlString positiveContent, string negativeContent)
        {
            return x.ReturnsIf(expression, CellTemplating.Template.SanitizeHtmlString(positiveContent), negativeContent);
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, string positiveContent, IHtmlString negativeContent)
        {
            return x.ReturnsIf(expression, positiveContent, CellTemplating.Template.SanitizeHtmlString(negativeContent));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorIf(this CellTemplateBuilder x, string expression, Func<object, HelperResult> positiveContent, Func<object, HelperResult> negativeContent)
        {
            return ReturnsIf(x, expression, positiveContent(new object()), negativeContent(new object()));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <param name="elseElment">What to return if condition not met</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, Action<Template> elment, Action<Template> elseElment)
        {
            return x.ReturnsIf(expression, CellTemplating.Template.BuildDelegate(elment), CellTemplating.Template.BuildDelegate(elseElment));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, Action<Template> elment)
        {
            return x.ReturnsIf(expression, CellTemplating.Template.BuildDelegate(elment));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, IHtmlString content)
        {
            return x.ReturnsIf(expression, CellTemplating.Template.SanitizeHtmlString(content));
        }


        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorIf(this CellTemplateBuilder x, string expression, Func<object, HelperResult> content)
        {
            return ReturnsIf(x, expression, content(new object()));
        }


        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder IfNotPresent(this CellTemplateBuilder x, string expression, IHtmlString content)
        {
            return x.IfNotPresent(expression, CellTemplating.Template.SanitizeHtmlString(content));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorIfNotPresent(this CellTemplateBuilder x, string expression, Func<object, HelperResult> content)
        {
            return IfNotPresent(x, expression, content(new object()));
        }
    }
}
