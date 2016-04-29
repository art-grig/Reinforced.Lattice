using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;
using PowerTables.Plugins;

namespace PowerTables.Filters
{

    public interface IHideableFilter
    {
        /// <summary>
        /// When true, filter UI is not being rendered but client query modifier persists
        /// </summary>
        bool Hidden { get; set; }
    }

    public static class CommonFiltersUiExtensions
    {
        /// <summary>
        /// Hides filter from the UI. Filtering functionality persists
        /// </summary>
        /// <param name="c"></param>
        /// <param name="hide">When true, filter will be hidden</param>
        /// <returns></returns>
        public static T HideFilter<T>(this T c, bool hide = true) where T : IHideableFilter
        {
            c.Hidden = hide;
            return c;
        }

        /// <summary>
        /// Enables client filtering and specifies custom client filtering function. 
        /// 
        /// Function type: (datarow:any, filterSelection:string[], query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// filterSelection: selected values
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        public static PluginConfigurationWrapper<T> ClientFiltering<T>(this PluginConfigurationWrapper<T> c, string function = null)
            where T : IClientFiltering, new()
        {
            c.Configuration.ClientFiltering = true;
            c.Configuration.ClientFilteringFunction = new JRaw(string.IsNullOrEmpty(function) ? "null" : function);
            return c;
        }

        /// <summary>
        /// Shortcut for specifying client filtering functions. Supports `{}`-style expressions
        /// 
        /// Function type: (datarow:any, filterSelection:string[], query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// filterSelection: selected values
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        public static PluginConfigurationWrapper<T> ClientFilteringExpression<T>(this PluginConfigurationWrapper<T> c, string expression = null)
            where T : IClientFiltering, new()
        {
            var expr = Template.CompileExpression(expression, "v", null);
            c.Configuration.ClientFiltering = true;
            c.Configuration.ClientFilteringFunction = new JRaw(string.Format("function(v) {{ return ({0}); }}",expr));
            return c;
        }

        /// <summary>
        /// Configures delay between field change and request processing begins (in milliseconds)
        /// </summary>
        public static PluginConfigurationWrapper<T> Inputdelay<T>(this PluginConfigurationWrapper<T> c, int delay = 500)
            where T : IInputDelay, new()
        {
            c.Configuration.InputDelay = delay;
            return c;
        }
    }

    public interface IClientFiltering
    {
        /// <summary>
        /// Turn this filter to be working on client-side
        /// </summary>
        bool ClientFiltering { get; set; }

        /// <summary>
        /// Specifies custom client filtering function. 
        /// Function type: (datarow:any, filterSelection:string[], query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// filterSelection: selected values
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        JRaw ClientFilteringFunction { get; set; }
    }

    public interface IInputDelay
    {
        /// <summary>
        /// Delay between field change and request processing begins
        /// </summary>
        int InputDelay { get; set; }
    }
}
