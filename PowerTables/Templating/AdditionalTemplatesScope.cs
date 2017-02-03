using System;
using System.IO;
using System.Web.Mvc;

namespace PowerTables.Templating
{
    public class AdditionalTemplatesScope : ITemplatesScope, IDisposable
    {
        public TextWriter Out { get { return _page.Output; } }
        public string TemplatesPrefix { get { return _prefix; } }
        public IViewPlugins Plugin { get { return _classifier; } }
        public bool CrunchingTemplate { get; set; }
        public SpecialString Raw(string tplCode)
        {
            return _hook.CreateRaw(tplCode);
        }

        public void WriteRaw(string tplCode)
        {
            _hook.WriteRaw(tplCode);
        }

        public void Dispose()
        {
            _page.OutputStack.Pop();
            if (_renderScriptTag) _page.WriteLiteral("</script>");
        }

        private readonly WebViewPage _page;
        private readonly IViewPlugins _classifier;
        private readonly string _prefix;
        private readonly ScopedWriter _hook;
        private readonly bool _renderScriptTag;
        public AdditionalTemplatesScope(WebViewPage page, string prefix, bool renderScriptTag = true)
        {
            _classifier = new PluginsClassifier(new LatticeTemplatesViewModel() { Prefix = prefix }, this);
            _page = page;
            _renderScriptTag = renderScriptTag;
            _prefix = prefix;
            if (_renderScriptTag) _page.WriteLiteral("<script type=\"text/javascript\">");
            _hook = new ScopedWriter(_page.Output, this);
            _page.OutputStack.Push(_hook);
        }
    }
}
