using System.IO;
using System.Web.Mvc;

namespace PowerTables.Templating
{
    public class PluginsClassifier : IViewPlugins
    {
        private readonly WebViewPage _page;

        private readonly LatticeTemplatesViewModel _model;
        public PluginsClassifier(WebViewPage page, LatticeTemplatesViewModel model)
        {
            _page = page;
            _model = model;
        }

        public TextWriter Writer { get { return _page.Output; } }
        public LatticeTemplatesViewModel Model { get { return _model; } }
    }
}