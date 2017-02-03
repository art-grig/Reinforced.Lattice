using System.IO;
using System.Web.Mvc;

namespace PowerTables.Templating.BuiltIn
{
    public class LayoutTemplateRegion : TemplateRegion, IProvidesEventsBinding
    {
        public LayoutTemplateRegion(string prefix, string templateId, ITemplatesScope scope)
            : base(TemplateRegionType.Custom,prefix, templateId, scope)
        {
        }
    }

    public static class LayoutTemplatingExtensions
    {
        /// <summary>
        /// Declares template region for table layout
        /// </summary>
        /// <returns>Template region</returns>
        public static LayoutTemplateRegion Layout(this ITemplatesScope t, string templateId = "layout")
        {
            return new LayoutTemplateRegion(t.TemplatesPrefix,templateId, t);
        }

        /// <summary>
        /// Placeholder for plugins at specific position
        /// </summary>
        /// <param name="position">Plugin position</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString Plugins(this LayoutTemplateRegion t, string position = null)
        {
            if (string.IsNullOrEmpty(position)) return t._("d.plugins(p);");
            return t._("d.plugins(p,'{0}');", position);
        }

        /// <summary>
        /// Placeholder for table body (cells and rows)
        /// </summary>
        public static MvcHtmlString Body(this LayoutTemplateRegion t)
        {
            return t._("d.body(p);");
        }

        /// <summary>
        /// Placeholder for table headers
        /// </summary>
        public static MvcHtmlString Headers(this LayoutTemplateRegion t)
        {
            return t._("d.headers(p);");
        }

        /// <summary>
        /// Placeholder for column filters
        /// </summary>
        public static MvcHtmlString Filters(this LayoutTemplateRegion t)
        {
            return t._("d.filters(p);");
        }

        /// <summary>
        /// Placeholder for column header
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString Header(this LayoutTemplateRegion t, string columnName)
        {
            return t._("d.header(p,'{0}');", columnName);
        }

        /// <summary>
        /// Placeholder for column filter
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString Filter(this LayoutTemplateRegion t, string columnName)
        {
            return t._("d.filter(p,'filter-{0}');", columnName);
        }

        
    }
}