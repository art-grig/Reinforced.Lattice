using System;
using PowerTables.Configuration;

namespace PowerTables.CellTemplating
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
        /// <param name="col">Column</param>
        /// <param name="elementsConf">Cell template builder</param>
        /// <returns>Fluent</returns>
        public static T Template<T>(this T col, Action<CellTemplateBuilder> elementsConf) where T : IColumnConfigurator
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder();
            elementsConf(ctb);
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
        /// <param name="format">Cell format in `{@}`-form</param>
        /// <returns>Fluent</returns>
        public static T Format<T>(this T col, string format) where T : IColumnConfigurator
        {
            CellTemplateBuilder ctb = new CellTemplateBuilder();
            ctb.Returns(format);
            var fun = ctb.Build();
            col.TemplateFunction(fun);
            return col;
        }
        
        /// <summary>
        /// Appends onclick attribute to element (usually button)
        /// </summary>
        /// <param name="b"></param>
        /// <param name="functionCall">Function call onclick. {Something} syntax supported </param>
        /// <returns>Fluent</returns>
        public static Template OnClick(this Template b, string functionCall)
        {
            return b.Attr("onclick", functionCall);
        }

        /// <summary>
        /// Appends target attribute to element (usually link)
        /// </summary>
        /// <param name="b"></param>
        /// <param name="target">Target value </param>
        /// <returns>Fluent</returns>
        public static Template Target(this Template b, string target)
        {
            return b.Attr("target", target);
        }

        /// <summary>
        /// Shortcut for formatting table cell as link for specified column
        /// </summary>
        /// <param name="col">Column</param>
        /// <param name="linkFormat">Link format. Use " + v.Something + " or "{Something}" to substitute table value</param>
        /// <param name="textFormat">Link text format. Use " + v.Something + " or "{Something}" to substitute table value</param>
        /// <param name="target">Link target. User "_blank" or something similar.</param>
        /// <returns>Fluent</returns>
        public static T Link<T>(this T col, string linkFormat, string textFormat, string target = null) where T : IColumnConfigurator
        {
            return col.Template(c =>
            {
                c.EmptyIfNotPresent("{" + col.ColumnConfiguration.RawColumnName + "}");
                c.Returns(a => a.Tag("a").Attr("href", linkFormat).Content(textFormat).Attr("target", target));
            });
        }

        

        
        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public static CellTemplateBuilder Returns(this CellTemplateBuilder x, Action<Template> elment)
        {
            return x.Returns(CellTemplating.Template.BuildDelegate(elment));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <param name="elseElment">What to return if condition not met</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, Action<Template> elment, Action<Template> elseElment)
        {
            return x.ReturnsIf(expression, CellTemplating.Template.BuildDelegate(elment), CellTemplating.Template.BuildDelegate(elseElment));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, Action<Template> elment)
        {
            return x.ReturnsIf(expression, CellTemplating.Template.BuildDelegate(elment));
        }

        

        
    }
}
