using System;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.Plugins;

namespace PowerTables.FrequentlyUsed
{
    public static class FrequentlyUsedExtensions
    {
        /// <summary>
        /// Shortcut for creating JS function that formats enum-typed column values to specified text specified using enum's fields [Display] attribute.
        /// This method uses MVC GetSelectList function to retrieve enum values.
        /// </summary>
        /// <param name="column">Colum to apply formatting</param>
        /// <returns>Fluent</returns>
        public static T TemplateEnum<T>(this T column, Action<Template> ifNotPresent = null) where T : IColumnConfigurator
        {
            var enumType = column.ColumnType;
            if (enumType.IsNullable())
            {
                enumType = enumType.GetGenericArguments()[0];
            }
            if (!typeof(Enum).IsAssignableFrom(enumType))
            {
                throw new Exception(
                    String.Format("This method is only applicable for enum columns. {0} column is not of enum type",
                    column.ColumnConfiguration.RawColumnName
                    ));
            }
            var items = EnumHelper.GetSelectList(enumType);

            column.Template(a =>
            {
                if (ifNotPresent != null) a.IfNotPresent("{" + column.ColumnConfiguration.RawColumnName + "}", ifNotPresent);
                else a.EmptyIfNotPresent("{" + column.ColumnConfiguration.RawColumnName + "}");
                a.Switch("{" + column.ColumnConfiguration.RawColumnName + "}",
                    swtch =>
                        swtch
                            .Cases(items, c => c.Value, (tpl, v) => tpl.Content(v.Text))
                            .DefaultEmpty());
            }

                );
            return column;
        }

        /// <summary>
        /// Shortcut for creating JS function that formats enum-typed column values to specified text specified using enum's fields [Display] attribute.
        /// This method uses MVC GetSelectList function to retrieve enum values.
        /// </summary>
        /// <param name="column">Colum to apply formatting</param>
        /// <param name="content">Content for particular select list item</param>
        /// <param name="empty">Template for empty element</param>
        /// <returns>Fluent</returns>
        public static T TemplateEnum<T>(this T column, Action<Template, SelectListItem> content, Action<Template> ifNotPresent = null) where T : IColumnConfigurator
        {
            var enumType = column.ColumnType;
            if (enumType.IsNullable())
            {
                enumType = enumType.GetGenericArguments()[0];
            }
            if (!typeof(Enum).IsAssignableFrom(enumType))
            {
                throw new Exception(
                    String.Format("This method is only applicable for enum columns. {0} column is not of enum type",
                    column.ColumnConfiguration.RawColumnName
                    ));
            }
            var items = EnumHelper.GetSelectList(enumType);

            column.Template(a =>
                {
                    if (ifNotPresent != null) a.IfNotPresent("{" + column.ColumnConfiguration.RawColumnName + "}", ifNotPresent);
                    else a.EmptyIfNotPresent("{" + column.ColumnConfiguration.RawColumnName + "}");
                    a.Switch("{" + column.ColumnConfiguration.RawColumnName + "}",
                        swtch =>
                            swtch
                                .Cases(items, c => c.Value, (tpl, v) => content(tpl.Content(v.Text), v))
                                .DefaultEmpty()
                    );
                }

                );
            return column;
        }

        /// <summary>
        /// Shortcut for creating JS function that formats enum-typed column values to specified text specified using enum's fields [Display] attribute.
        /// This method uses MVC GetSelectList function to retrieve enum values.
        /// </summary>
        /// <param name="expression">If - expression</param>
        /// <param name="switchExpression">Expression to trean as enum</param>
        /// <param name="content">Template for empty element</param>
        /// <returns>Fluent</returns>
        public static CellTemplateBuilder TemplateEnumIf<TEnum>(this CellTemplateBuilder x, string expression, string switchExpression, Action<Template, SelectListItem> content)
        {
            var enumType = typeof(TEnum);
            if (enumType.IsNullable())
            {
                enumType = enumType.GetGenericArguments()[0];
            }
            if (!typeof(Enum).IsAssignableFrom(enumType))
            {
                throw new Exception("This method is only applicable for enums.");
            }
            var items = EnumHelper.GetSelectList(enumType);

            x.SwitchIf(expression, switchExpression, swtch =>
                swtch
                    .Cases(items, c => c.Value, (tpl, v) => content(tpl.Content(v.Text), v))
                    .DefaultEmpty());

            
            return x;
        }

        /// <summary>
        /// Shortcut for creating JS function that formats boolean column values to specified text
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="trueText">Text when value is TRUE</param>
        /// <param name="falseText">Text when value is FALSE</param>
        /// <returns>Fluent</returns>
        public static T TextForBoolean<T>(this T column, string trueText, string falseText) where T : IColumnTargetProperty<bool>
        {
            column.Template(
                tpl =>
                    tpl.ReturnsIf("{" + column.ColumnConfiguration.RawColumnName + "}", v => v.Content(trueText),
                        v => v.Content(falseText)));
            return column;
        }


        /// <summary>
        /// Shortcut for creating multi-select filter for boolean value
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="column">Column configuration</param>
        /// <param name="sourceColumn">Source column</param>
        /// <param name="trueText">Text for true</param>
        /// <param name="falseText">Text for false</param>
        /// <param name="bothText">Text for both value (a.k.a. "not matter")</param>
        /// <param name="allowBoth">Allow "not matter" case or not</param>
        /// <param name="ui">UI builder</param>
        /// <returns>Value filter</returns>
        public static ValueColumnFilter<TSourceData, bool>
            FilterBoolean
            <TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, bool> column,
            Expression<Func<TSourceData, bool>> sourceColumn,
            string trueText, string falseText, string bothText = null, bool allowBoth = true,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig, bool>> ui = null
            ) where TTableData : new()
        {
            var items = new[]
            {
                new SelectListItem {Text = trueText,Value = "True"}, 
                new SelectListItem {Text = falseText,Value = "False"} 
            };

            var cf = column.FilterSelect(sourceColumn, v =>
            {
                v.SelectAny(allowBoth, bothText).SelectItems(items);
                if (ui != null) ui(v);
            });
            return cf;

        }

        /// <summary>
        /// Shortcut for creating multi-select filter for boolean value
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="column">Column configuration</param>
        /// <param name="filterDelegate"></param>
        /// <param name="trueText">Text for true</param>
        /// <param name="falseText">Text for false</param>
        /// <param name="bothText">Text for both value (a.k.a. "not matter")</param>
        /// <param name="allowBoth">Allow "not matter" case or not</param>
        /// <param name="ui">UI builder</param>
        /// <returns>Value filter</returns>
        public static ValueColumnFilter<TSourceData, bool>
            FilterBooleanBy
            <TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, bool> column,
            Func<IQueryable<TSourceData>, bool, IQueryable<TSourceData>> filterDelegate,
            string trueText, string falseText, string bothText = null, bool allowBoth = true,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig, bool>> ui = null
            ) where TTableData : new()
        {
            var items = new[]
            {
                new SelectListItem {Text = trueText,Value = "True"}, 
                new SelectListItem {Text = falseText,Value = "False"} 
            };

            var cf = column.FilterSelectBy(filterDelegate, v =>
            {
                v.SelectAny(allowBoth, bothText).SelectItems(items);
                if (ui != null) ui(v);
            });
            return cf;

        }

        /// <summary>
        /// Shortcut for creating multi-select filter for boolean value
        /// </summary>
        /// <param name="column">Column configuration</param>
        /// <param name="trueText">Text for true</param>
        /// <param name="falseText">Text for false</param>
        /// <param name="bothText">Text for both value (a.k.a. "not matter")</param>
        /// <param name="allowBoth">Allow "not matter" case or not</param>
        /// <returns>Value filter</returns>
        public static void FilterBooleanUi(this IColumnTargetProperty<bool> column,
            string trueText, string falseText, string bothText = null, bool allowBoth = true,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig, bool>> ui = null
            )
        {
            var items = new[]
            {
                new SelectListItem {Text = trueText,Value = "True"}, 
                new SelectListItem {Text = falseText,Value = "False"} 
            };

            column.FilterSelectUi(v =>
            {
                v.SelectAny(allowBoth, bothText).SelectItems(items);
                if (ui != null) ui(v);
            });
        }

        private static void DoDateFormatColumnUsage<TTableColumn>(IColumnTargetProperty<TTableColumn> col, string format = null, bool utc = false)
        {
            col.Template(
                c =>
                    c.EmptyIfNotPresent("{" + col.ColumnConfiguration.RawColumnName + "}")
                        .Returns(string.Format("`dateFormat({{{0}}},'{1}',{2})`", col.ColumnConfiguration.RawColumnName, format, utc ? "true" : "false")));
        }

        /// <summary>
        /// Shortcut for JS function formatting DateTime column value with dateformat.js
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="format">dateformat.js-friendly format</param>
        /// <param name="utc">"utc" parameter to be supplied to dateformat.js</param>
        public static T FormatDateWithDateformatJs<T>(this T col, string format = null, bool utc = false) where T : IColumnTargetProperty<DateTime>
        {
            DoDateFormatColumnUsage(col, format, utc);
            return col;
        }

        /// <summary>
        /// Shortcut for JS function formatting DateTime column value with dateformat.js
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="format">dateformat.js-friendly format</param>
        /// <param name="utc">"utc" parameter to be supplied to dateformat.js</param>
        public static T FormatNullableDateWithDateformatJs<T>(this T col, string format = null, bool utc = false) where T : IColumnTargetProperty<DateTime?>
        {
            DoDateFormatColumnUsage(col, format, utc);
            return col;
        }

        /// <summary>
        /// Shortcut for bootstrap glyphicon
        /// </summary>
        /// <param name="glyphiconName">Bootstrap blyphicon class</param>
        /// <param name="flt">Conditional float value</param>
        /// <returns>HTML, span-wrapped string for desired glyphicon</returns>
        public static string GlyphIcon(this string glyphiconName, string flt = null)
        {
            if (string.IsNullOrEmpty(flt))
            {
                return String.Format("<span class=\"glyphicon glyphicon-{0}\"></span>   ", glyphiconName);
            }
            return String.Format("<span class=\"glyphicon glyphicon-{0}\" style=\"float:{1}\"></span>   ", glyphiconName, flt);
        }




    }
}
