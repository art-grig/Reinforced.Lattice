using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Templating
{
    public class VisualStateDescription
    {
        [JsonProperty("classes")]
        public List<string> Classes { get; private set; }

        [JsonProperty("attrs")]
        public Dictionary<string, string> Attrs { get; private set; }

        [JsonProperty("styles")]
        public Dictionary<string, string> Styles { get; private set; }

        [JsonProperty("content")]
        public string Content { get; set; }

        public VisualStateDescription()
        {
            Classes = new List<string>();
            Attrs = new Dictionary<string, string>();
            Styles = new Dictionary<string, string>();
        }
    }

    public class SpecialVisualStateDescription<T>
    {
        public VisualState State { get; private set; }

        public SpecialVisualStateDescription(VisualState state)
        {
            State = state;
        }
    }

    public class VisualState
    {
        public VisualStateDescription Description { get; set; }

        public VisualState()
        {
            Description = new VisualStateDescription();
        }
    }


    public static class VisualStateExtensions
    {
        public static VisualState AddClass(this VisualState state, string @class)
        {
            state.Description.Classes.Add(string.Format("+{0}", @class));
            return state;
        }

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

        public static VisualState Attr(this VisualState state, string attrName, string attrValue)
        {
            state.Description.Attrs[attrName] = attrValue;
            return state;
        }

        public static VisualState RemoveAttr(this VisualState state, string attrName)
        {
            state.Description.Attrs[attrName] = null;
            return state;
        }

        public static VisualState Style(this VisualState state, string styleName, string styleValue)
        {
            state.Description.Styles[styleName] = styleValue;
            return state;
        }

        public static VisualState Disabled(this VisualState state)
        {
            state.Attr("disabled", "disabled");
            return state;
        }

        public static VisualState Hide(this VisualState state)
        {
            state.Style("display", "none");
            return state;
        }

        public static VisualState Show(this VisualState state, string display = "block")
        {
            state.Style("display", display);
            return state;
        }

        public static VisualState Color(this VisualState state, string color)
        {
            state.Style("color", color);
            return state;
        }

        public static VisualState Content(this VisualState state, string contentPropertyOrFunction)
        {
            state.Description.Content = contentPropertyOrFunction;
            return state;
        }

        public static SpecialVisualStateDescription<T> Special<T>(this VisualState state, IModelProvider<T> forTemplate)
        {
            return new SpecialVisualStateDescription<T>(state);
        }

        public static SpecialVisualStateDescription<TViewModel> Special<TViewModel>(this VisualState state)
        {
            return new SpecialVisualStateDescription<TViewModel>(state);
        }

        public static SpecialVisualStateDescription<T> Content<T, TData>(this SpecialVisualStateDescription<T> t,
            Expression<Func<T, TData>> property)
        {
            t.State.Content(HbExtensions.TraversePropertyLambda(property));
            return t;
        }
    }
}
