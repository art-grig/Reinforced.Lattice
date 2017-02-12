using System;
using System.Collections.Generic;
using System.Web;
using System.Web.WebPages;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Commands;
using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.Mvc
{
    public static class RazorTemplatesExtensions
    {
        /// <summary>
        /// Specifies template for single condition
        /// </summary>
        /// <param name="caseExpression">Case `{@}`-expression</param>
        /// <param name="template">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public static SwitchBuilder RazorWhen(this SwitchBuilder x, string caseExpression, Func<object, HelperResult> content)
        {
            return x.When(caseExpression, String.Format("'{0}'", content(new object())));
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
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder Razor(this CellTemplateBuilder x, Func<object, HelperResult> content)
        {
            return x.Returns(content(new object()));
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
            return x.ReturnsIf(expression, positiveContent(new object()), negativeContent(new object()));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorIf(this CellTemplateBuilder x, string expression, Func<object, HelperResult> content)
        {
            return x.ReturnsIf(expression, content(new object()));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorIfNotPresent(this CellTemplateBuilder x, string expression, Func<object, HelperResult> content)
        {
            return x.IfNotPresent(expression, content(new object()));
        }

        #region Razor switch

        /// <summary>
        /// Adds switch Switch operator to templating function
        /// </summary>
        /// <param name="expression">Expression to switch</param>
        /// <param name="swtch">Switch builder action</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorSwitch(this CellTemplateBuilder x, string expression, Action<RazorSwitchBuilder> swtch)
        {
            RazorSwitchBuilder swb = new RazorSwitchBuilder(expression, x.Flow.ObjectProperty, x.Flow.DefaultProperty);
            swtch(swb);
            x.Flow.Line(swb.Build());
            return x;
        }


        /// <summary>
        /// Adds switch Switch operator to templating function
        /// </summary>
        /// <param name="expression">Expression to switch</param>
        /// <param name="swtch">Switch builder action</param>
        /// <returns></returns>
        public static T RazorSwitch<T>(this T x, string expression, Action<RazorSwitchBuilder> swtch) where T : IColumnConfigurator
        {
            return x.Template(c => c.RazorSwitch(expression, swtch));
        }

        #endregion

        /// <summary>
        /// Replaces escaped %XX-symbols used by Lattice with regular symbols. 
        /// This method only affects `,@,{,} symbols
        /// </summary>
        /// <param name="s">Escaped HTML string</param>
        /// <returns></returns>
        public static string TemplateHTMLDecode(this string s)
        {
            return HtmlStringExtensions.SanitizeHtmlString(s);
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder Returns(this CellTemplateBuilder x, IHtmlString content)
        {
            return x.Returns(HtmlStringExtensions.SanitizeHtmlString(content));
        }

        /// <summary>
        /// Specifies template for default condition
        /// </summary>
        /// <param name="content">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public static SwitchBuilder RazorDefault(this SwitchBuilder x, Func<object, HelperResult> content)
        {
            return x.Default(content(new object()));
        }

        /// <summary>
        /// Specifies template builders for several cases
        /// </summary>
        /// <typeparam name="T">Case option element type</typeparam>
        /// <param name="options">Set of available options for cases</param>
        /// <param name="expression">Case `{@}`-expression builder for every option</param>
        /// <param name="template">Template builder for every option</param>
        /// <returns></returns>
        public static SwitchBuilder Cases<T>(this SwitchBuilder x, IEnumerable<T> options, Func<T, string> expression, Func<T, IHtmlString> template)
        {
            foreach (var option in options)
            {
                x.When(expression(option), template(option));
            }
            return x;
        }

        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="swtch">Switch to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorSwitchIfNotPresent(this CellTemplateBuilder x, string expression, string switchExpression, Action<RazorSwitchBuilder> swtch)
        {
            return x.RazorSwitchIf(string.Format("(({0})==null)||(({0})==undefined)", expression), switchExpression, swtch);
        }

        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="switchExpression">Switch expression</param>
        /// <param name="swtch">Switch to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorSwitchIf(this CellTemplateBuilder x, string expression, string switchExpression, Action<RazorSwitchBuilder> swtch)
        {
            RazorSwitchBuilder swb = new RazorSwitchBuilder(switchExpression, x.Flow.ObjectProperty, x.Flow.DefaultProperty);
            swtch(swb);
            expression = Template.CompileExpression(expression, "v", x.Flow.ObjectProperty, x.Flow.DefaultProperty);
            var line = string.Format("if ({0}) {{ {1} }} ", expression, swb.Build());
            x.Flow.Line(line);
            return x;
        }

        public static T RazorPart<T>(this T cmd, string templatePiece, Func<object, HelperResult> content) where T : CommandConfirmationConfigurator
        {
            return cmd.Part(templatePiece, x => x.Razor(content));
        }

    }
}
