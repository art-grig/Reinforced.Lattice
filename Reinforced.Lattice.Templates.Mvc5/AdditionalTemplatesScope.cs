﻿using System;
using System.Web.Mvc;
using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates
{
    public class AdditionalTemplatesScope : DeclaratorBase, ITemplatesScope, IDisposable
    {
        public TemplateControl Flow { get; private set; }

        public string TemplatesPrefix { get { return _prefix; } }

        public IViewPlugins Plugin { get { return _classifier; } }

        public Inline Raw(string tplCode)
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
            this.Flow = new TemplateControl(() => _page.Output);
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
