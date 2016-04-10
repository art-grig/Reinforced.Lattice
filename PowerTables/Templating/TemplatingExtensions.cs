using System.Web.Mvc;
using System.Web.Mvc.Html;
using JetBrains.Annotations;
using PowerTables.Configuration;
using PowerTables.Templating.BuiltIn;

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
        /// <param name="arguments">Event arguments</param>
        /// <returns></returns>
        public static MvcHtmlString BindEvent(this IProvidesEventsBinding t, string commaSeparatedFunction, string commaSeparatedEvents, params string[] arguments)
        {
            return
                MvcHtmlString.Create(string.Format("{{{{BindEvent \"{0}\" \"{1}\" {2} }}}}", commaSeparatedFunction,
                commaSeparatedEvents, arguments.Length == 0 ? null : string.Join(" ", arguments)));
        }

        private static readonly MvcHtmlString _track = MvcHtmlString.Create("{{{Track}}}");

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

        public static MvcHtmlString Content(this IProvidesColumnContent t, string columnName)
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Content \"{0}\"}}}}}}", columnName));
        }



    }


}
