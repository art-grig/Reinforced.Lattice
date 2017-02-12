using System;
using System.Web.WebPages;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.Mvc
{
    public static class TemplateBooleanExtensions
    {
        /// <summary>
        /// Shortcut for templating column having well-known set of values exposed as MVC select list items
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="caseFalse">Razor being generated in case of false</param>
        /// <param name="caseTrue">Razor being generated in case of true</param>
        /// <param name="column">Template builder</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T RazorBoolean<T>(this T column,
           Func<object, HelperResult> caseTrue = null,
            Func<object, HelperResult> caseFalse = null,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            ValidateBoolean(column.ColumnType);
            return column.Template(x => x.RazorBoolean(caseTrue, caseFalse, switchExpression, deflt, swtc));
        }


        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="caseFalse">Razor being generated in case of false</param>
        /// <param name="caseTrue">Razor being generated in case of true</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder RazorBoolean(this CellTemplateBuilder x,
            Func<object, HelperResult> caseTrue = null,
            Func<object, HelperResult> caseFalse = null,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null)
        {
            if (caseTrue == null) caseTrue = a => new HelperResult(_ => _.Write("Yes"));
            if (caseFalse == null) caseFalse = a => new HelperResult(_ => _.Write("No"));

            return x.RazorSwitch(switchExpression, a =>
            {
                a.When("true", caseTrue);
                a.When("false", caseFalse);
                if (deflt != null) a.Default(deflt);
                if (swtc != null) swtc(a);
            });
        }

        private static void ValidateBoolean(Type t)
        {
            if (t.IsNullable())
            {
                t = t.GetArg();
            }
            if (t != typeof(bool)) throw new Exception("Boolean templating cannot be applied on non-boolean columns");
        }
    }
}
