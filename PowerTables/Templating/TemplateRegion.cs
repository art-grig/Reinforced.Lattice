using System;
using System.IO;

namespace PowerTables.Templating
{
    public class TemplateRegion : IDisposable, ITemplateRegion
    {
        private readonly ScopedWriter _writer;
        private readonly ITemplatesScope _scope;

        public TextWriter Writer
        {
            get { return _writer; }
        }

        internal TemplateRegion(string prefix, string id, ITemplatesScope scope)
        {
            _writer = (ScopedWriter) scope.Out;
            _scope = scope;
            _writer.Write(string.Format(";_ltcTpl._('{0}','{1}',function(o,d,w) {{",prefix,id));
            scope.CrunchingTemplate = true;
        }

        public virtual void Dispose()
        {
            _scope.CrunchingTemplate = false;
            _writer.Write("});");
        }

        public virtual void Raw(string tplCode)
        {
            _writer.WriteRaw(tplCode);
        }
    }
}
