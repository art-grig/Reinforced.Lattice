using System.IO;
using System.Text;
using System.Web.Mvc;
using System.Web.WebPages;
using System.Web.WebPages.Instrumentation;

namespace PowerTables.Templating
{
    public abstract class TemplatesPageBase : WebViewPage<LatticeTemplatesViewModel>, ITemplatesScope
    {
        public override void ExecutePageHierarchy()
        {
            this.WriteLiteral("<script type=\"text/javascript\">");
            _hook = new ScopedWriter(base.GetOutputWriter(), this);
            OutputStack.Push(_hook);
            base.ExecutePageHierarchy();
            OutputStack.Pop();
            this.WriteLiteral("</script>");
        }

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
            return new TemplateRegion(Model.Prefix, id, this);
        }

        private IViewPlugins _plugins = null;

        /// <summary>
        /// Templates for particular plugins
        /// </summary>
        public IViewPlugins Plugin
        {
            get
            {
                if (_plugins == null) _plugins = new PluginsClassifier(this.Model, this);
                return _plugins;
            }
        }

        public bool CrunchingTemplate { get; set; }
        public void Raw(string tplCode)
        {
            _hook.WriteRaw(tplCode);
        }

        public TextWriter Out { get { return GetOutputWriter(); } }

        private ScopedWriter _hook = null;

        protected override TextWriter GetOutputWriter()
        {
            return _hook;
        }



        /// <summary>
        /// Templates prefix
        /// </summary>
        public string TemplatesPrefix { get { return Model.Prefix; } }

        
    }
}
