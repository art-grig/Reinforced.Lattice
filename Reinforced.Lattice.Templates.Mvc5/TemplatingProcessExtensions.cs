using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Newtonsoft.Json;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates
{
    public static class TemplatingProcessExtensions
    {
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
        public static Inline Mark(this IProvidesMarking t, string fieldName, string key = null, string receiver = null)
        {
            return
                t._("p.m('{0}',{1},{2});", fieldName, key.WrapQuotesOrNull(),
                    receiver.WrapQuotesOrNull());
        }

        /// <summary>
        /// Specifies VisualStat for mentioned element
        /// </summary>
        /// <param name="state">Visual state-providing region</param>
        /// <param name="stateName">Visual state name</param>
        /// <param name="visualState">Visual state builder</param>
        /// <returns>Template instruction to cache Visual state for mentioned element</returns>
        public static Inline State(this IProvidesVisualState state, string stateName, Action<VisualState> visualState)
        {
            VisualState vs = new VisualState();
            visualState(vs);
            var json = JsonConvert.SerializeObject(vs.Description, Formatting.None);
            if (string.IsNullOrEmpty(json)) json = "null";
            return state._("p.vs('{0}',{1});", stateName, json);
        }

        /// <summary>
        /// Specifies VisualStat for mentioned element
        /// </summary>
        /// <param name="state">Visual state-providing region</param>
        /// <param name="stateName">Visual state name</param>
        /// <param name="visualState">Visual state builder</param>
        /// <returns>Template instruction to cache Visual state for mentioned element</returns>
        public static Inline State(this IProvidesVisualState state, string stateName, VisualState visualState)
        {
            var json = JsonConvert.SerializeObject(visualState.Description, Formatting.None);
            if (string.IsNullOrEmpty(json)) json = "null";
            return state._("p.vs('{0}',{1});", stateName, json);
        }

        /// <summary>
        /// Sets JavaScript function that will be called after mentioned element is rendered. 
        /// Rendered element's HTMLElement object will be passed as 1st parameter to this function
        /// </summary>
        /// <param name="ts">Template scope </param>
        /// <param name="functionName">Callback function reference or literal function</param>
        /// <param name="rawArgs">Other arguments to provide. Remember that here should be not constant values but Handlebar's JS expression. Feel free to include references to teimplate's viewMdel here</param>
        /// <returns></returns>
        public static Inline Callback(this ITemplatesScope ts, string functionName, params string[] rawArgs)
        {
            var args = string.Join(",", rawArgs);
            return ts._("p.rc('{0}',[{1}]);", functionName, args);
        }

        /// <summary>
        /// Sets JavaScript function that will be called after mentioned element is prepared to be destroyed (removed from HTML document). 
        /// Rendered element's HTMLElement object will be passed as 1st parameter to this function
        /// </summary>
        /// <param name="ts">Template scope </param>
        /// <param name="functionName">Callback function reference or literal function</param>
        /// <param name="rawArgs">Other arguments to provide. Remember that here should be not constant values but Handlebar's JS expression. Feel free to include references to teimplate's viewMdel here</param>
        /// <returns></returns>
        public static Inline DestroyCallback(this ITemplatesScope ts, string functionName, params string[] rawArgs)
        {
            var args = string.Join(",", rawArgs);
            return ts._("p.dc('{0}',[{1}]);", functionName, args);
        }

        /// <summary>
        /// Sets JavaScript function that will be called after mentioned element is rendered. 
        /// Rendered element's HTMLElement object will be passed as 1st parameter to this function
        /// </summary>
        /// <param name="ts">Template scope </param>
        /// <param name="functionName">Callback function reference or literal function</param>
        /// <param name="args">Other arguments to provide. Remember that here should be not constant values but Handlebar's JS expression. Feel free to include references to teimplate's viewMdel here</param>
        /// <returns></returns>
        public static Inline Callback<T>(this IModelProvider<T> ts, string functionName, params Expression<Func<T,object>>[] args)
        {
            List<string> rawArgs = new List<string>();
            foreach (var expression in args)
            {
                rawArgs.Add(JsExtensions.TraversePropertyLambda(expression,ts.ExistingModel));
            }
            var a = string.Join(",", rawArgs);
            return ts._("p.rc('{0}',[{1}]);", functionName, a);
        }

        /// <summary>
        /// Sets JavaScript function that will be called after mentioned element is prepared to be destroyed (removed from HTML document). 
        /// Rendered element's HTMLElement object will be passed as 1st parameter to this function
        /// </summary>
        /// <param name="ts">Template scope </param>
        /// <param name="functionName">Callback function reference or literal function</param>
        /// <param name="args">Other arguments to provide. Remember that here should be not constant values but Handlebar's JS expression. Feel free to include references to teimplate's viewMdel here</param>
        /// <returns></returns>
        public static Inline DestroyCallback<T>(this IModelProvider<T> ts, string functionName, params Expression<Func<T, object>>[] args)
        {
            List<string> rawArgs = new List<string>();
            foreach (var expression in args)
            {
                rawArgs.Add(JsExtensions.TraversePropertyLambda(expression, ts.ExistingModel));
            }
            var a = string.Join(",", rawArgs);
            return ts._("p.dc('{0}',[{1}]);", functionName, a);
        }

        /// <summary>
        /// Binds event at specified element
        /// </summary>
        /// <param name="t">Template region</param>
        /// <param name="commaSeparatedFunction">Comma-separated functions list to be bound</param>
        /// <param name="commaSeparatedEvents">Comma-separated events list to be bound</param>
        /// <param name="arguments">Event arguments</param>
        /// <returns></returns>
        public static Inline BindEvent(this IProvidesEventsBinding t, string commaSeparatedFunction, string commaSeparatedEvents, params string[] arguments)
        {
            return t._("p.e('{0}','{1}',[{2}]);", commaSeparatedFunction, commaSeparatedEvents, arguments.Length == 0 ? "null" : string.Join(",", arguments));
        }

        /// <summary>
        /// Marks element where should be conditional datepicker. 
        /// If specified column is of DateTime type - there will be datepicker. 
        /// Otherwise nothing happens
        /// </summary>
        /// <param name="t"></param>
        /// <param name="condition">Condition of turning input into datepicker</param>
        /// <param name="nullableCondition">Condition of datepicker to provide nullable date</param>
        /// <returns></returns>
        public static Inline DatepickerIf(this IProvidesDatepicker t, string condition, string nullableCondition)
        {
            return t._("p.dp(({0}),({1}));", condition, nullableCondition);
        }
    }
}
