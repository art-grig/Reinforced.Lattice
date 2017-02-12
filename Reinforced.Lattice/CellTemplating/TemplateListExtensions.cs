using System;
using System.Collections.Generic;
using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.CellTemplating
{
    public static class TemplateListExtensions
    {
        #region Column methods
        

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
        public static T TemplateList<T, TItem>(this T column,
            IEnumerable<TItem> items,
            Func<TItem, string> caseValue,
            Action<Template, TItem> content,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            column.Template(x =>
            {
                x.TemplateList(items, caseValue, content, switchExpression, deflt, swtc);
            });
            return column;
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values
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
        public static T FormatList<T, TItem>(this T column,
            IEnumerable<TItem> items,
            Func<TItem, string> caseValue,
            Func<TItem, string> content,
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            column.Template(x =>
            {
                x.FormatList(items, caseValue, content, switchExpression, deflt, swtc);
            });
            return column;
        }

        #endregion

        #region Core methods
        /// <summary>
        /// Shortcut for templating cell having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="x">Template builder</param>
        /// <param name="items">Set of possible options</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder FormatList<T>(this CellTemplateBuilder x,
            IEnumerable<T> items,
            Func<T, string> caseValue,
            Func<T, string> content,
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null)
        {

            x.Switch(switchExpression, swtch =>
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

        /// <summary>
        /// Shortcut for templating cell having well-known set of values
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
        public static CellTemplateBuilder TemplateList<T>(this CellTemplateBuilder x,
            IEnumerable<T> items,
            Func<T, string> caseValue,
            Action<Template, T> content,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null)
        {

            x.Switch(switchExpression, swtch =>
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

       
        #endregion
    }
}
