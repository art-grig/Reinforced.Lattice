using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.WebPages;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.Mvc
{
    public static class TemplateSelectListExtensions
    {
        #region SelectListItem methods

        #region Columns
        /// <summary>
        /// Shortcut for templating column having well-known set of values exposed as MVC select list items
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T RazorSelectList<T>(this T column,
            IEnumerable<SelectListItem> items,
            Func<SelectListItem, string> caseValue,
            Func<SelectListItem, HelperResult> content,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            if (caseValue == null) caseValue = _ => _.Value;
            if (content == null) content = i => new HelperResult(_ => _.Write(i));
            return column.RazorList(items, caseValue, content, switchExpression, deflt, swtc);
        }


        /// <summary>
        /// Shortcut for templating column having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T TemplateSelectList<T>(this T column,
            IEnumerable<SelectListItem> items,
            Func<SelectListItem, string> caseValue,
            Action<Template, SelectListItem> content,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            if (caseValue == null) caseValue = _ => _.Value;
            if (content == null) content = (t, i) => t.Content(i.Text);
            return column.TemplateList(items, caseValue, content, switchExpression, deflt, swtc);

        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T FormatSelectList<T>(this T column,
            IEnumerable<SelectListItem> items,
            Func<SelectListItem, string> caseValue,
            Func<SelectListItem, string> content,
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            if (caseValue == null) caseValue = _ => _.Value;
            if (content == null) content = _ => string.Format("'{0}'", _.Text);
            return column.FormatList(items, caseValue, content, switchExpression, deflt, swtc);

        }

        #endregion

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value. By default returns SelectListItem.Text</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory). By default returns SelectListItem.Value</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder RazorSelectList(this CellTemplateBuilder x,
            IEnumerable<SelectListItem> items,
            Func<SelectListItem, string> caseValue = null,
            Func<SelectListItem, HelperResult> content = null,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null)
        {
            if (caseValue == null) caseValue = _ => _.Value;
            if (content == null) content = i => new HelperResult(_ => _.Write(i));
            return x.RazorList(items, caseValue, content, switchExpression, deflt, swtc);
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value. By default returns SelectListItem.Text</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory). By default returns SelectListItem.Value</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder TemplateSelectList(this CellTemplateBuilder x,
            IEnumerable<SelectListItem> items,
            Func<SelectListItem, string> caseValue = null,
            Action<Template, SelectListItem> content = null,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null)
        {
            if (caseValue == null) caseValue = _ => _.Value;
            if (content == null) content = (t, i) => t.Content(i.Text);
            return x.TemplateList(items, caseValue, content, switchExpression, deflt, swtc);
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value. By default returns SelectListItem.Text</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory). By default returns SelectListItem.Value</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder FormatSelectList(this CellTemplateBuilder x,
            IEnumerable<SelectListItem> items,
            Func<SelectListItem, string> caseValue = null,
            Func<SelectListItem, string> content = null,
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null)
        {
            if (caseValue == null) caseValue = _ => _.Value;
            if (content == null) content = _ => string.Format("'{0}'", _.Text);
            return x.FormatList(items, caseValue, content, switchExpression, deflt, swtc);
        }

        #endregion
    }
}
