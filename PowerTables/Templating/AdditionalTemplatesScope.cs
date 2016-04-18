using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerTables.Templating
{
    public class AdditionalTemplatesScope : ITemplatesScope, IDisposable
    {
        public TextWriter Output { get { return _page.Output; } }
        public string TemplatesPrefix { get { return _prefix; } }
        public IViewPlugins Plugin { get { return _classifier; } }
        public void Dispose()
        {

        }

        private readonly WebViewPage _page;
        private readonly IViewPlugins _classifier;
        private readonly string _prefix;
        public AdditionalTemplatesScope(WebViewPage page, string prefix)
        {
            _classifier = new PluginsClassifier(page, new LatticeTemplatesViewModel() { Prefix = prefix });
            _page = page;
            _prefix = prefix;
        }
    }
}
