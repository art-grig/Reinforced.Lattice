using System.Linq;
using System.Web.Mvc;
using System.Web.WebPages;
using PowerTables.Templating.BuiltIn;

namespace PowerTables.Templating
{
    public abstract class TemplatesPageBase : WebViewPage<LatticeTemplatesViewModel>, ITemplatesScope
    {
        /// <summary>
        /// Default templates view. Used for shortening .RenderTemplates calls
        /// </summary>
        public static string DefaultTemplatesView;

        /// <summary>
        /// Declares raw template region
        /// </summary>
        /// <param name="id">Template id</param>
        /// <returns>template region</returns>
        public TemplateRegion Template(string id)
        {
            return new TemplateRegion(Model.Prefix, id, this.GetOutputWriter());
        }

        private IViewPlugins _plugins = null;

        /// <summary>
        /// Templates for particular plugins
        /// </summary>
        public IViewPlugins Plugin
        {
            get
            {
                if (_plugins == null) _plugins = new PluginsClassifier(this, this.Model);
                return _plugins;
            }
        }



        public MvcHtmlString Callback(string functionName, params string[] rawArgs)
        {
            var args = string.Join(" ", rawArgs);
            return MvcHtmlString.Create(string.Format("{{{{{{RenderCallback \"{0}\" {1} }}}}}}", functionName, args));
        }

        /// <summary>
        /// Templates prefix
        /// </summary>
        public string TemplatesPrefix { get { return Model.Prefix; } }
    }
}
