using System.Web.Mvc;
using PowerTables.Configuration;

namespace PowerTables.Templating
{
    /// <summary>
    /// Helper extensions for rendering
    /// </summary>
    public static class TemplatingExtensions
    {
        /// <summary>
        /// Binds event at specified element
        /// </summary>
        /// <param name="t">Template region</param>
        /// <param name="commaSeparatedFunction">Comma-separated functions list to be bound</param>
        /// <param name="commaSeparatedEvents">Comma-separated events list to be bound</param>
        /// <returns></returns>
        public static MvcHtmlString BindEvent(this IProvidesEventsBinding t, string commaSeparatedFunction, string commaSeparatedEvents)
        {
            return
                MvcHtmlString.Create(string.Format("{{{{ BindEvent \"{0}\" \"{1}\" }}}}", commaSeparatedFunction,
                    commaSeparatedEvents));
        }

        private static readonly MvcHtmlString _body = MvcHtmlString.Create("{{Body}}");
        private static readonly MvcHtmlString _headers = MvcHtmlString.Create("{{Headers}}");
        private static readonly MvcHtmlString _filters = MvcHtmlString.Create("{{ColumnFilters}}");

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
        /// Placeholder for plugins at specific position
        /// </summary>
        /// <param name="position">Plugin position</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString Plugins(this LayoutTemplateRegion t, PluginPosition position)
        {
            return MvcHtmlString.Create(string.Format("{{{{Plugins \"{0}\"}}}}", position.ToJsFriendly()));
        }

        /// <summary>
        /// Placeholder for toolbar plugins at specific position
        /// </summary>
        /// <param name="position">Plugin position</param>
        /// <returns>Placeholder template entry</returns>
        public static MvcHtmlString ToolbarPlugins(this LayoutTemplateRegion t, PluginPosition position)
        {
            return MvcHtmlString.Create(string.Format("{{{{ToolbarPlugins \"{0}\"}}}}", position.ToJsFriendly()));
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
            return MvcHtmlString.Create(string.Format("{{{{ColumnFilter \"{0}\"}}}}", columnName));
        }

        private static readonly MvcHtmlString _track = MvcHtmlString.Create("{{Track}}");
        
        /// <summary>
        /// Placeholder for tracking ticket. It is necessary for some complonents
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static MvcHtmlString Track(this IProvidesTracking t)
        {
            t.IsTrackSet = true;
            return _track;
        }

        private static readonly MvcHtmlString _content = MvcHtmlString.Create("{{{Content}}}");
        public static MvcHtmlString Content(this IProvidesContent t)
        {
            return _content;
        }

        public static MvcHtmlString Content(this IProvidesColumnContent t,string columnName)
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Content \"{0}\"}}}}}}", columnName));
        }

        
    }
}
