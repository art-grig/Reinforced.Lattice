using System;
using System.Web.WebPages;
using PowerTables.Configuration;

namespace PowerTables.CellTemplating
{
    public static class TemplateBooleanExtensions
    {
        #region Boolean methods

        #region Columns
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
        /// Shortcut for templating column having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <param name="caseFalse">Template that will be applied in case of false</param>
        /// <param name="caseTrue">Template that will be applied in case of true</param>
        /// <returns>Fluent</returns>
        public static T TemplateBoolean<T>(this T column,
            Action<Template> caseTrue = null,
            Action<Template> caseFalse = null,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            ValidateBoolean(column.ColumnType);
            return column.Template(x => x.TemplateBoolean(caseTrue, caseFalse, switchExpression, deflt, swtc));
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <param name="caseFalse">Expression bein returned in case of false</param>
        /// <param name="caseTrue">Expression being returned in case of true</param>
        /// <returns>Fluent</returns>
        public static T FormatBoolean<T>(this T column,
            string caseTrue = null,
            string caseFalse = null,
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            ValidateBoolean(column.ColumnType);
            return column.Template(x => x.FormatBoolean(caseTrue, caseFalse, switchExpression, deflt, swtc));
        }

        #endregion

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

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="caseFalse">Template that will be applied in case of false</param>
        /// /// <param name="caseTrue">Template that will be applied in case of true</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>

        /// <returns>Fluent</returns>
        public static CellTemplateBuilder TemplateBoolean(this CellTemplateBuilder x,
            Action<Template> caseTrue = null,
            Action<Template> caseFalse = null,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null)
        {
            if (caseTrue == null) caseTrue = a => a.Content("Yes");
            if (caseFalse == null) caseFalse = a => a.Content("No");

            return x.Switch(switchExpression, a =>
            {
                a.When("true", caseTrue);
                a.When("false", caseFalse);
                if (deflt != null) a.Default(deflt);
                if (swtc != null) swtc(a);
            });
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="caseFalse">Expression bein returned in case of false</param>
        /// <param name="caseTrue">Expression being returned in case of true</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder FormatBoolean(this CellTemplateBuilder x,
            string caseTrue = "'Yes'",
            string caseFalse = "'No'",
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null)
        {
            return x.Switch(switchExpression, a =>
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
        #endregion
    }
}
