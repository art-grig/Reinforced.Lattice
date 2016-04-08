using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.FrequentlyUsed
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
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <typeparam name="TTableColumn"></typeparam>
        /// <param name="col">Column</param>
        /// <param name="elementsConf">Cell template builder</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> Template<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> col, Action<CellTemplateBuilder> elementsConf) where TTableData : new()
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder();
            elementsConf(ctb);
            var fun = ctb.Build();
            col.ValueFunction(fun);
            return col;
        }

        /// <summary>
        /// Appends onclick attribute to element (usually button)
        /// </summary>
        /// <param name="b"></param>
        /// <param name="functionCall">Function call onclick. {Something} syntax supported </param>
        /// <returns>Fluent</returns>
        public static TemplateElementBuilder OnClick(this TemplateElementBuilder b, string functionCall)
        {
            return b.Attr("onclick", functionCall);
        }

        /// <summary>
        /// Appends target attribute to element (usually link)
        /// </summary>
        /// <param name="b"></param>
        /// <param name="target">Target value </param>
        /// <returns>Fluent</returns>
        public static TemplateElementBuilder Target(this TemplateElementBuilder b, string target)
        {
            return b.Attr("target", target);
        }

        /// <summary>
        /// Shortcut for formatting table cell as link for specified column
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <typeparam name="TTableColumn"></typeparam>
        /// <param name="col">Column</param>
        /// <param name="linkFormat">Link format. Use " + v.Something + " or "{Something}" to substitute table value</param>
        /// <param name="textFormat">Link text format. Use " + v.Something + " or "{Something}" to substitute table value</param>
        /// <param name="target">Link target. User "_blank" or something similar.</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> Link<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> col, string linkFormat, string textFormat, string target = null) where TTableData : new()
        {
            return col.Template(c =>
            {
                c.EmptyIfNotPresent(col.ColumnConfiguration.RawColumnName);
                c.Returns(a => a.Tag("a").Attr("href", linkFormat).Inside(textFormat).Attr("target", target));
            });
        }
    }
}
