using System;
using System.IO;

namespace PowerTables.Templating
{
    public class TemplateRegion : IDisposable, ITemplateRegion
    {
        private readonly ScopedWriter _writer;
        private readonly ITemplatesScope _scope;
        public TemplateRegionType Type { get; private set; }
        public TextWriter Writer
        {
            get { return _writer; }
        }

        internal TemplateRegion(TemplateRegionType type, string prefix, string id, ITemplatesScope scope)
        {
            _writer = (ScopedWriter)scope.Out;
            _scope = scope;
            Type = type;
            _writer.Write(string.Format(";_ltcTpl._('{0}','{1}',function(o,d,w,p) {{ p.d(o,{2});", prefix, id, (int)type));
            scope.CrunchingTemplate = true;
        }

        public virtual void Dispose()
        {
            _scope.CrunchingTemplate = false;
            _writer.Write("p.u();});");
        }

        public virtual void Raw(string tplCode)
        {
            _writer.WriteRaw(tplCode);
        }
    }
}
