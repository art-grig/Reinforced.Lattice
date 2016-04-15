using System.IO;
using System.Web.Mvc;

namespace PowerTables.Templating.BuiltIn
{
    public class LayoutTemplateRegion : TemplateRegion, IProvidesEventsBinding
    {
        public LayoutTemplateRegion(string prefix, string templateId, TextWriter writer)
            : base(prefix, templateId, writer)
        {
        }
    }

    public static class LayoutTemplatingExtensions
    {
        /// <summary>
        /// Declares template region for table layout
        /// </summary>
        /// <returns>Template region</returns>
        public static LayoutTemplateRegion Layout(this TemplatesPageBase t, string templateId = "layout")
        {
            return new LayoutTemplateRegion(t.Model.Prefix,templateId, t.Output);
        }

        /// <summary>
        /// Placeholder for plugins at specific position
        /// </summary>
        /// <param name="position">Plugin position</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString Plugins(this LayoutTemplateRegion t, string position = null)
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Plugins \"{0}\"}}}}}}", position));
        }

        private static readonly MvcHtmlString _body = MvcHtmlString.Create("{{{Body}}}");
        private static readonly MvcHtmlString _headers = MvcHtmlString.Create("{{{Headers}}}");
        private static readonly MvcHtmlString _filters = MvcHtmlString.Create("{{{Plugins \"filter\"}}}");

        /// <summary>
        /// Placeholder for table body (cells and rows)
        /// </summary>
        public static MvcHtmlString Body(this LayoutTemplateRegion t)
        {
            return _body;
        }

        /// <summary>
        /// Placeholder for table headers
        /// </summary>
        public static MvcHtmlString Headers(this LayoutTemplateRegion t)
        {
            return _headers;
        }

        /// <summary>
        /// Placeholder for column filters
        /// </summary>
        public static MvcHtmlString Filters(this LayoutTemplateRegion t)
        {
            return _filters;
        }

        /// <summary>
        /// Placeholder for column header
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString Header(this LayoutTemplateRegion t, string columnName)
        {
            return MvcHtmlString.Create(string.Format("{{{{Header \"{0}\"}}}}", columnName));
        }

        /// <summary>
        /// Placeholder for column filter
        /// </summary>
        /// <param name="columnName">Column name</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString Filter(this LayoutTemplateRegion t, string columnName)
        {
            return MvcHtmlString.Create(string.Format("{{{{Plugin \"filter-{0}\"}}}}", columnName));
        }

        
    }
}