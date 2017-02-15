using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates.BuiltIn
{
    public class LayoutTemplateRegion : TemplateRegion, IProvidesEventsBinding
    {
        public LayoutTemplateRegion(string prefix, string templateId, ITemplatesScope scope)
            : base(TemplateRegionType.Custom, prefix, templateId, scope)
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
            return new LayoutTemplateRegion(t.TemplatesPrefix, templateId, t);
        }

        /// <summary>
        /// Placeholder for plugins at specific position
        /// </summary>
        /// <param name="position">Plugin position</param>
        /// <returns>Placeholder template entry</returns>
        public static Inline Plugins(this LayoutTemplateRegion t, string position = null)
        {
            return t._("d.plugins(p,'{0}');", position ?? "null");
        }

        /// <summary>
        /// Placeholder for table body (cells and rows)
        /// </summary>
        public static Inline Body(this LayoutTemplateRegion t)
        {
            return t._("d.body(p);");
        }

        /// <summary>
        /// Placeholder for table headers
        /// </summary>
        public static Inline Headers(this LayoutTemplateRegion t)
        {
            return t._("d.headers(p);");
        }

        /// <summary>
        /// Placeholder for column filters
        /// </summary>
        public static Inline Filters(this LayoutTemplateRegion t)
        {
            return t._("d.plugins(p,'filter');");
        }

        /// <summary>
        /// Placeholder for column header
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <returns>Placeholder template entry</returns>
        public static Inline Header(this LayoutTemplateRegion t, string columnName)
        {
            return t._("d.colHeader(p,'{0}');", columnName);
        }

        /// <summary>
        /// Placeholder for column filter
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <returns>Placeholder template entry</returns>
        public static Inline Filter(this LayoutTemplateRegion t, string columnName)
        {
            return t._("d.filter(p,'filter-{0}');", columnName);
        }


    }
}