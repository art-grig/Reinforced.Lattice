using System.IO;
using System.Web.Mvc;
using System.Web.WebPages;
using PowerTables.Templating.BuiltIn;

namespace PowerTables.Templating
{
    public abstract class TemplatesPageBase : WebViewPage<LatticeTemplatesViewModel>
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
                if (_plugins == null) _plugins = new PluginsClassifier(this);
                return _plugins;
            }
        }

        private class PluginsClassifier : IViewPlugins
        {
            public PluginsClassifier(TemplatesPageBase page)
            {
                Page = page;
            }

            public TextWriter Writer { get { return Page.GetOutputWriter(); } }
            public LatticeTemplatesViewModel Model { get { return Page.Model; } }
            public TemplatesPageBase Page { get; private set; }
        }

    }


}
