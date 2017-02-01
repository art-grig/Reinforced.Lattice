using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.CellTemplating;
using PowerTables.Configuration;

namespace PowerTables.Mvc.Extensions
{
    public static class UiExtensions
    {
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