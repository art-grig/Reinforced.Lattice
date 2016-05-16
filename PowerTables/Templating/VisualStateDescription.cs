using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Newtonsoft.Json;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Templating
{
    /// <summary>
    /// JSON configuration of particular visual state for particular element
    /// </summary>
    public class VisualStateDescription
    {
        /// <summary>
        /// Classes that should be added to element
        /// </summary>
        [JsonProperty("classes")]
        public List<string> Classes { get; private set; }

        /// <summary>
        /// Attributes that should be added or set to the to element
        /// </summary>
        [JsonProperty("attrs")]
        public Dictionary<string, string> Attrs { get; private set; }

        /// <summary>
        /// Styles that should be changed
        /// </summary>
        [JsonProperty("styles")]
        public Dictionary<string, string> Styles { get; private set; }

        /// <summary>
        /// Content to be set in particular state (only constant string, no templating)
        /// </summary>
        [JsonProperty("content")]
        public string Content { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public VisualStateDescription()
        {
            Classes = new List<string>();
            Attrs = new Dictionary<string, string>();
            Styles = new Dictionary<string, string>();
        }
    }

    /// <summary>
    /// Generic VisualState wrapper for parameter-specific extension methods
    /// </summary>
    /// <typeparam name="T">ViewState's template view model</typeparam>
    // ReSharper disable once UnusedTypeParameter
    public class SpecialVisualStateDescription<T>
    {
        /// <summary>
        /// Visual State object
        /// </summary>
        public VisualState State { get; private set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        /// <param name="state"></param>
        public SpecialVisualStateDescription(VisualState state)
        {
            State = state;
        }
    }

    /// <summary>
    /// Described visual state of element. 
    /// Usually in Lattice elements are being fully re-rendered and re-created when their state changes. 
    /// In some cases it is not allowed to destroy elements (e.g. they can contain user input). For above  
    /// cases Lattice has Visual states mechanism. Use <see cref="TemplatingExtensions.State(PowerTables.Templating.IProvidesVisualState,string,System.Action{PowerTables.Templating.VisualState})"/> method to 
    /// set visual state for particular element. Visual state consistes of 2 parts - the key of visual state (e.g. text field 
    /// can contain states "saving", "invalid" or "normal") - and set of changes that should be applied to mentioned element in particular state. 
    /// Visual state key "normal" is reserved and being created automatically by Latttice while rendering. 
    /// Try do not to overload your code with Visual States since it can lead to memory consumption grow. 
    /// Visual States can be "mixed". E.g. it is ok for checkbox editor to be in "checked" and "saving state simultaneously.
    /// Visual state mixing is controlled by plugin and you cannot change this behavior without overriding plugin
    /// </summary>
    public class VisualState
    {
        /// <summary>
        /// JSON visual state configuration reference
        /// </summary>
        public VisualStateDescription Description { get; private set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public VisualState()
        {
            Description = new VisualStateDescription();
        }

        /// <summary>
        /// Creates new VisualState instance from delegate applying 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="state"></param>
        /// <returns></returns>
        public static VisualState FromSpecialDelegate<T>(Action<SpecialVisualStateDescription<T>> state)
        {
            var vs = new VisualState();
            var vss = vs.Special<T>();
            state(vss);
            return vs;
        }
    }

    /// <summary>
    /// Extensions for visual states
    /// </summary>
    public static class VisualStateExtensions
    {
        /// <summary>
        /// Specified CSS class should be added to element in this state
        /// </summary>
        /// <param name="state">VisualState</param>
        /// <param name="class">Class name to add</param>
        /// <returns>Fluent</returns>
        public static VisualState AddClass(this VisualState state, string @class)
        {
            state.Description.Classes.Add(string.Format("+{0}", @class));
            return state;
        }

        /// <summary>
        /// Specified CSS class should be removed from element in this state
        /// </summary>
        /// <param name="state">VisualState</param>
        /// <param name="class">Class name to add</param>
        /// <returns>Fluent</returns>
        public static VisualState RemoveClass(this VisualState state, string @class)
        {
            var add = string.Format("+{0}", @class);
            if (state.Description.Classes.Contains(add))
            {
                state.Description.Classes.Remove(add);
                return state;
            }
            state.Description.Classes.Add(string.Format("-{0}", @class));
            return state;
        }

        /// <summary>
        /// Specified attribute of mentioned element should be changed to provided value in this state. 
        /// If this attribute does not exist on mentioned element then it will be created
        /// </summary>
        /// <param name="state">Visual State</param>
        /// <param name="attrName">Attribute name</param>
        /// <param name="attrValue">Attribute value to set</param>
        /// <returns>Fluent</returns>
        public static VisualState Attr(this VisualState state, string attrName, string attrValue)
        {
            state.Description.Attrs[attrName] = attrValue;
            return state;
        }

        /// <summary>
        /// Specified attribute of mentioned element should be removed in this state. 
        /// If this attribute does not exist on mentioned element then nothing will happen
        /// </summary>
        /// <param name="state">Visual State</param>
        /// <param name="attrName">Attribute name</param>
        /// <returns>Fluent</returns>
        public static VisualState RemoveAttr(this VisualState state, string attrName)
        {
            state.Description.Attrs[attrName] = null;
            return state;
        }

        /// <summary>
        /// Specified CSS style of the mentioned element should be changed to provided value in this state
        /// </summary>
        /// <param name="state">Visual State</param>
        /// <param name="styleName">CSS style name</param>
        /// <param name="styleValue">CSS style value</param>
        /// <returns>Fluent</returns>
        public static VisualState Style(this VisualState state, string styleName, string styleValue)
        {
            state.Description.Styles[styleName] = styleValue;
            return state;
        }

        /// <summary>
        /// Mentioned element will be disabled in this state. 
        /// Elements are being disabled with setting "disabled" attribute
        /// </summary>
        /// <param name="state">Visual State</param>
        /// <returns>Fluent</returns>
        public static VisualState Disabled(this VisualState state)
        {
            state.Attr("disabled", "disabled");
            return state;
        }

        /// <summary>
        /// Mentioned element will be hidden in this state. 
        /// Elements are being hidden by setting display:none; CSS style to them
        /// </summary>
        /// <param name="state">Visual State</param>
        /// <returns>Fluent</returns>
        public static VisualState Hide(this VisualState state)
        {
            state.Style("display", "none");
            return state;
        }

        /// <summary>
        /// Mentioned element will be shown in this state. 
        /// Elements are being hidden by setting display CSS style to them to value specified by <paramref name="display"/> 
        /// parameter
        /// </summary>
        /// <param name="state">Visual State</param>
        /// <param name="display">Value to be set for display CSS style</param>
        /// <returns>Fluent</returns>
        public static VisualState Show(this VisualState state, string display = "block")
        {
            state.Style("display", display);
            return state;
        }

        /// <summary>
        /// Font color will be changed for mentioned element in this state. 
        /// Color is changed by setting "color" CSS style for element
        /// </summary>
        /// <param name="state">Visual State</param>
        /// <param name="color">Color in CSS-friendly value</param>
        /// <returns>Fluent</returns>
        public static VisualState Color(this VisualState state, string color)
        {
            state.Style("color", color);
            return state;
        }

        /// <summary>
        /// innerHTML of mentioned element will be set to specified value in this state
        /// </summary>
        /// <param name="state">VisualState</param>
        /// <param name="contentPropertyOrFunction">Reference to template ViewModel's field, constant or function</param>
        /// <returns></returns>
        public static VisualState Content(this VisualState state, string contentPropertyOrFunction)
        {
            state.Description.Content = contentPropertyOrFunction;
            return state;
        }

        /// <summary>
        /// Converts VisualState object to stongly-typed one using reference to template's viewModel
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="state">Visual State</param>
        /// <param name="forTemplate">Desired template viewModel</param>
        /// <returns></returns>
        public static SpecialVisualStateDescription<T> Special<T>(this VisualState state, IModelProvider<T> forTemplate)
        {
            return new SpecialVisualStateDescription<T>(state);
        }

        /// <summary>
        /// Converts VisualState object to stongly-typed one using reference to template's viewModel
        /// </summary>
        /// <typeparam name="TViewModel">Target desired ViewModel type</typeparam>
        /// <param name="state">Visual State</param>
        /// <returns></returns>
        public static SpecialVisualStateDescription<TViewModel> Special<TViewModel>(this VisualState state)
        {
            return new SpecialVisualStateDescription<TViewModel>(state);
        }

        /// <summary>
        /// innerHTML of mentioned element will be set to specified template's ViewModel value in this state
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TData"></typeparam>
        /// <param name="t">Special ViewState parametrized by Template's ViewModel</param>
        /// <param name="property">Property that should be set as content</param>
        /// <returns>Fluent</returns>
        public static SpecialVisualStateDescription<T> Content<T, TData>(this SpecialVisualStateDescription<T> t,
            Expression<Func<T, TData>> property)
        {
            t.State.Content(HbExtensions.TraversePropertyLambda(property));
            return t;
        }
    }
}
