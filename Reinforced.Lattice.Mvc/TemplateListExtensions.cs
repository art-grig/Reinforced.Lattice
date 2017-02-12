using System;
using System.Collections.Generic;
using System.Web.WebPages;
using PowerTables.CellTemplating;
using PowerTables.Configuration;

namespace Reinforced.Lattice.Mvc
{
    public static class TemplateListExtensions
    {
        /// <summary>
        /// Shortcut for templating column having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TItem"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T RazorList<T, TItem>(this T column,
            IEnumerable<TItem> items,
            Func<TItem, string> caseValue,
            Func<TItem, HelperResult> content,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            column.Template(x =>
            {
                x.RazorList(items, caseValue, content, switchExpression, deflt, swtc);
            });
            return column;
        }

        /// <summary>
        /// Shortcut for Razor-powered templating cell having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="x">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns></returns>
        public static CellTemplateBuilder RazorList<T>(this CellTemplateBuilder x,
            IEnumerable<T> items,
            Func<T, string> caseValue,
            Func<T, HelperResult> content,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null)
        {

            x.RazorSwitch(switchExpression, swtch =>
            {
                swtch.Cases(items, caseValue, content);
                if (deflt == null)
                {
                    swtch.DefaultEmpty();
                }
                else
                {
                    swtch.Default(deflt);
                }
                if (swtc != null) swtc(swtch);
            });
            return x;
        }

    }
}
