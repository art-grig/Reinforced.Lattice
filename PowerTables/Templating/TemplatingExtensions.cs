using System;
using System.Web.Mvc;
using Newtonsoft.Json;

// ReSharper disable InconsistentNaming

namespace PowerTables.Templating
{
    /// <summary>
    /// Helper extensions for rendering
    /// </summary>
    public static class TemplatingExtensions
    {
        /// <summary>
        /// Begins region containing additional Lattice templates
        /// </summary>
        /// <param name="page">Web page where you want to begin additional templates region</param>
        /// <param name="templatesPrefix">Templates prefix for </param>
        /// <returns></returns>
        public static AdditionalTemplatesScope LatticeAdditionalTemplates(this WebViewPage page, string templatesPrefix = "lt")
        {
            return new AdditionalTemplatesScope(page, templatesPrefix);
        }

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

        ///// <summary>
        ///// Marks element where should be conditional datepicker. 
        ///// If specified column is of DateTime type - there will be datepicker. 
        ///// Otherwise nothing happens
        ///// </summary>
        ///// <param name="t"></param>
        ///// <param name="columnExpression">Column name to determine is datepicker needed or not</param>
        ///// <param name="forceNullable">Force datepicker to produce nullable date</param>
        ///// <returns></returns>
        //public static MvcHtmlString Datepicker(this IProvidesDatepicker t, string columnExpression, bool forceNullable = false)
        //{
        //    return
        //        MvcHtmlString.Create(string.Format("{{{{{{Datepicker {0} {1} }}}}}}", columnExpression, forceNullable.ToString().ToLower()));
        //}

        /// <summary>
        /// Marks element where should be conditional datepicker. 
        /// If specified column is of DateTime type - there will be datepicker. 
        /// Otherwise nothing happens
        /// </summary>
        /// <param name="t"></param>
        /// <param name="condition">Condition of turning input into datepicker</param>
        /// <param name="nullableCondition">Condition of datepicker to provide nullable date</param>
        /// <returns></returns>
        public static MvcHtmlString DatepickerIf(this IProvidesDatepicker t, string condition, string nullableCondition)
        {
            return
                MvcHtmlString.Create(string.Format("{{{{{{Datepicker {0} {1} }}}}}}", condition, nullableCondition));
        }

        private static string WrapQuotesOrNull(this string param)
        {
            if (string.IsNullOrEmpty(param)) return "null";
            return string.Concat("\"", param, "\"");
        }
        /// <summary>
        /// Marks specified element and provides plugin with it further. 
        /// After plugin rendering, marked element will be put to plugin/header instance 
        /// into filed denoted with fieldName
        /// </summary>
        /// <param name="t"></param>
        /// <param name="fieldName">Where to put HTMLElement</param>
        /// <param name="key">Key to place element to hash</param>
        /// <param name="receiver">Object (relative to window) that will receive element instance</param>
        /// <returns></returns>
        public static MvcHtmlString Mark(this IProvidesMarking t, string fieldName, string key = null, string receiver = null)
        {
            return
                MvcHtmlString.Create(string.Format("{{{{{{Mark \"{0}\" {1} {2}}}}}}}", fieldName, key.WrapQuotesOrNull(), receiver.WrapQuotesOrNull()));
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

        /// <summary>
        /// Content of <paramref name="t"/> should be put here
        /// </summary>
        /// <param name="t">Content provider</param>
        /// <returns>Template placeholder for content</returns>
        public static MvcHtmlString Content(this IProvidesContent t)
        {
            return _content;
        }

        /// <summary>
        /// Content of <paramref name="t"/>'s for column <paramref name="columnName"/> should be put here
        /// </summary>
        /// <param name="t">Content provider</param>
        /// <param name="columnName">Column name to output content for</param>
        /// <returns>Template placeholder for content</returns>
        public static MvcHtmlString Content(this IProvidesColumnContent t, string columnName)
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Content \"{0}\"}}}}}}", columnName));
        }

        /// <summary>
        /// Specifies VisualStat for mentioned element
        /// </summary>
        /// <param name="state">Visual state-providing region</param>
        /// <param name="stateName">Visual state name</param>
        /// <param name="visualState">Visual state builder</param>
        /// <returns>Template instruction to cache Visual state for mentioned element</returns>
        public static MvcHtmlString State(this IProvidesVisualState state, string stateName, Action<VisualState> visualState)
        {
            VisualState vs = new VisualState();
            visualState(vs);
            var json = JsonConvert.SerializeObject(vs.Description, Formatting.None);
            return MvcHtmlString.Create(string.Format("{{{{{{VState \"{0}\" '{1}' }}}}}}", stateName, json));

        }

        /// <summary>
        /// Specifies VisualStat for mentioned element
        /// </summary>
        /// <param name="state">Visual state-providing region</param>
        /// <param name="stateName">Visual state name</param>
        /// <param name="visualState">Visual state builder</param>
        /// <returns>Template instruction to cache Visual state for mentioned element</returns>
        public static MvcHtmlString State(this IProvidesVisualState state, string stateName, VisualState visualState)
        {
            var json = JsonConvert.SerializeObject(visualState.Description, Formatting.None);
            return MvcHtmlString.Create(string.Format("{{{{{{VState \"{0}\" '{1}' }}}}}}", stateName, json));

        }

        /// <summary>
        /// Sets JavaScript function that will be called after mentioned element is rendered. 
        /// Rendered element's HTMLElement object will be passed as 1st parameter to this function
        /// </summary>
        /// <param name="ts">Template scope </param>
        /// <param name="functionName">Callback function reference or literal function</param>
        /// <param name="rawArgs">Other arguments to provide. Remember that here should be not constant values but Handlebar's JS expression. Feel free to include references to teimplate's viewMdel here</param>
        /// <returns></returns>
        public static MvcHtmlString Callback(this ITemplatesScope ts, string functionName, params string[] rawArgs)
        {
            var args = string.Join(" ", rawArgs);
            return MvcHtmlString.Create(string.Format("{{{{{{RenderCallback \"{0}\" {1} }}}}}}", functionName, args));
        }

        /// <summary>
        /// Sets JavaScript function that will be called after mentioned element is prepared to be destroyed (removed from HTML document). 
        /// Rendered element's HTMLElement object will be passed as 1st parameter to this function
        /// </summary>
        /// <param name="ts">Template scope </param>
        /// <param name="functionName">Callback function reference or literal function</param>
        /// <param name="rawArgs">Other arguments to provide. Remember that here should be not constant values but Handlebar's JS expression. Feel free to include references to teimplate's viewMdel here</param>
        /// <returns></returns>
        public static MvcHtmlString DestroyCallback(this ITemplatesScope ts, string functionName, params string[] rawArgs)
        {
            var args = string.Join(" ", rawArgs);
            return MvcHtmlString.Create(string.Format("{{{{{{DestroyCallback \"{0}\" {1} }}}}}}", functionName, args));
        }


    }


}
