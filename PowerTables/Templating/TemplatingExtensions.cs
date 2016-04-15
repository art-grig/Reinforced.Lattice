using System;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using JetBrains.Annotations;
using Newtonsoft.Json;
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
                MvcHtmlString.Create(string.Format("{{{{{{BindEvent \"{0}\" \"{1}\" {2} }}}}}}", commaSeparatedFunction,
                commaSeparatedEvents, arguments.Length == 0 ? null : string.Join(" ", arguments)));
        }

        /// <summary>
        /// Marks element where should be conditional datepicker. 
        /// If specified column is of DateTime type - there will be datepicker. 
        /// Otherwise nothing happens
        /// </summary>
        /// <param name="t"></param>
        /// <param name="columnExpression">Column name to determine is datepicker needed or not</param>
        /// <returns></returns>
        public static MvcHtmlString Datepicker(this IProvidesDatepicker t, string columnExpression)
        {
            return
                MvcHtmlString.Create(string.Format("{{{{{{Datepicker {0}}}}}}}", columnExpression));
        }

        /// <summary>
        /// Marks specified element and provides plugin with it further. 
        /// After plugin rendering, marked element will be put to plugin/header instance 
        /// into filed denoted with fieldName
        /// </summary>
        /// <param name="t"></param>
        /// <param name="fieldName">Where to put HTMLElement</param>
        /// <param name="key">Key to place element to hash</param>
        /// <returns></returns>
        public static MvcHtmlString Mark(this IProvidesMarking t, string fieldName, string key = null)
        {
            return
                MvcHtmlString.Create(string.Format("{{{{{{Mark \"{0}\" {1}}}}}}}", fieldName, string.IsNullOrEmpty(key) ? "null" : key));
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

        public static MvcHtmlString State(this IProvidesVisualState state, string stateName, Action<VisualState> visualState)
        {
            VisualState vs = new VisualState();
            visualState(vs);
            var json = JsonConvert.SerializeObject(vs.Description, Formatting.None);
            return MvcHtmlString.Create(string.Format("{{{{{{VState \"{0}\" '{1}' }}}}}}", stateName, json));

        }

        public static MvcHtmlString State(this IProvidesVisualState state, string stateName, VisualState visualState)
        {
            var json = JsonConvert.SerializeObject(visualState.Description, Formatting.None);
            return MvcHtmlString.Create(string.Format("{{{{{{VState \"{0}\" '{1}' }}}}}}", stateName, json));

        }

    }


}
