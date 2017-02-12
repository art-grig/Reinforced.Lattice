using System;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.WebPages;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Configuration;

#if MVC4
using System.Reflection;
using System.ComponentModel.DataAnnotations;
#endif
namespace Reinforced.Lattice.Mvc
{
    public static class TemplateEnumExtensions
    {
        #region Enum methods

        #region Columns
        /// <summary>
        /// Shortcut for templating column having well-known set of values exposed as MVC select list items
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T RazorEnum<T>(this T column,
            Func<SelectListItem, string> caseValue = null,
            Func<SelectListItem, HelperResult> content = null,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            return column.RazorSelectList(GetEnumSelectList(column.ColumnProperty.PropertyType), caseValue, content, switchExpression, deflt, swtc);
        }


        /// <summary>
        /// Shortcut for templating column having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T TemplateEnum<T>(this T column,
            Func<SelectListItem, string> caseValue = null,
            Action<Template, SelectListItem> content = null,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            return column.TemplateSelectList(GetEnumSelectList(column.ColumnProperty.PropertyType), caseValue, content, switchExpression, deflt, swtc);
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="column">Template builder</param>
        /// <param name="content">Template delegate to template value</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory).</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static T FormatEnum<T>(this T column,
            Func<SelectListItem, string> caseValue = null,
            Func<SelectListItem, string> content = null,
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null) where T : IColumnConfigurator
        {
            return column.FormatSelectList(GetEnumSelectList(column.ColumnProperty.PropertyType), caseValue, content, switchExpression, deflt, swtc);
        }

        #endregion

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="content">Template delegate to template value. By default returns SelectListItem.Text</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory). By default returns SelectListItem.Value</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder RazorEnum<T>(this CellTemplateBuilder x,
            Func<SelectListItem, string> caseValue = null,
            Func<SelectListItem, HelperResult> content = null,
            string switchExpression = "{@}",
            Func<object, HelperResult> deflt = null,
            Action<RazorSwitchBuilder> swtc = null)
        {
            return x.RazorSelectList(GetEnumSelectList(typeof(T)), caseValue, content, switchExpression, deflt, swtc);
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="content">Template delegate to template value. By default returns SelectListItem.Text</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory). By default returns SelectListItem.Value</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder TemplateEnum<T>(this CellTemplateBuilder x,
            Func<SelectListItem, string> caseValue = null,
            Action<Template, SelectListItem> content = null,
            string switchExpression = "{@}",
            Action<Template> deflt = null,
            Action<SwitchBuilder> swtc = null)
        {
            return x.TemplateSelectList(GetEnumSelectList(typeof(T)), caseValue, content, switchExpression, deflt, swtc);
        }

        /// <summary>
        /// Shortcut for templating cell having well-known set of values and sorce values exposed as MVC select list items
        /// </summary>
        /// <param name="x">Template builder</param>
        /// <param name="content">Template delegate to template value. By default returns SelectListItem.Text</param>
        /// <param name="caseValue">Selector of case value: pattern to compare with. Must return text representation of JS expression. So if you are switching by string values then this delegate must return 'YourString' (quotes mandatory). By default returns SelectListItem.Value</param>
        /// <param name="switchExpression">{@}-expression to test. by default is "{@}" </param>
        /// <param name="deflt">Template for default case (when cell value didnt match any of supplied options)</param>
        /// <param name="swtc">Raw switch builder to provide more flexibility</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder FormatEnum<T>(this CellTemplateBuilder x,
            Func<SelectListItem, string> caseValue = null,
            Func<SelectListItem, string> content = null,
            string switchExpression = "{@}",
            string deflt = null,
            Action<SwitchBuilder> swtc = null)
        {
            return x.FormatSelectList(GetEnumSelectList(typeof(T)), caseValue, content, switchExpression, deflt, swtc);
        }

#if MVC4
        private static string GetDisplayName(FieldInfo field)
        {
            DisplayAttribute display = field.GetCustomAttribute<DisplayAttribute>(inherit: false);
            if (display != null)
            {
                string name = display.GetName();
                if (!String.IsNullOrEmpty(name))
                {
                    return name;
                }
            }

            return field.Name;
        }
#endif

        private static IEnumerable<SelectListItem> GetEnumSelectList(Type type)
        {
            var enumType = type;
            if (enumType.IsNullable())
            {
                enumType = enumType.GetGenericArguments()[0];
            }
            if (!typeof(Enum).IsAssignableFrom(enumType))
            {
                throw new Exception(
                    String.Format("This method is only applicable for enum columns. {0} is not of enum type",
                    type
                    ));
            }

#if MVC4
            IList<SelectListItem> selectList = new List<SelectListItem>();

            // According to HTML5: "The first child option element of a select element with a required attribute and
            // without a multiple attribute, and whose size is "1", must have either an empty value attribute, or must
            // have no text content."  SelectExtensions.DropDownList[For]() methods often generate a matching
            // <select/>.  Empty value for Nullable<T>, empty text for round-tripping an unrecognized value, or option
            // label serves in some cases.  But otherwise, ignoring this does not cause problems in either IE or Chrome.
            Type checkedType = Nullable.GetUnderlyingType(type) ?? type;
            if (checkedType != type)
            {
                // Underlying type was non-null so handle Nullable<T>; ensure returned list has a spot for null
                selectList.Add(new SelectListItem { Text = String.Empty, Value = String.Empty, });
            }

            // Populate the list
            const BindingFlags BindingFlags =
                BindingFlags.DeclaredOnly | BindingFlags.GetField | BindingFlags.Public | BindingFlags.Static;
            foreach (FieldInfo field in checkedType.GetFields(BindingFlags))
            {
                // fieldValue will be an numeric type (byte, ...)
                object fieldValue = field.GetRawConstantValue();

                selectList.Add(new SelectListItem { Text = GetDisplayName(field), Value = fieldValue.ToString(), });
            }

            return selectList;
#else
            
            return EnumHelper.GetSelectList(enumType);
#endif
        }
#endregion
    }
}
