using System;
using System.IO;

namespace PowerTables.Templating
{
    public class TemplateRegion : DeclaratorBase, IDisposable, ITemplateRegion
    {
        private readonly ScopedWriter _writer;
        private readonly ITemplatesScope _scope;
        public TemplateRegionType Type { get; protected set; }
        public TextWriter Writer
        {
            get { return _writer; }
        }

        internal TemplateRegion(TemplateRegionType type, string prefix, string id, ITemplatesScope scope)
        {
            _writer = (ScopedWriter)scope.Out;
            _scope = scope;
            Type = type;
            _writer.Write(string.Format(";PowerTables.Templating._ltcTpl._('{0}','{1}',function(o,d,w,p,s){{p.d(o,{2});", prefix, id, (int)type));
            scope.CrunchingTemplate = true;
        }

        public virtual void Dispose()
        {
            _scope.CrunchingTemplate = false;
            _writer.Write("p.u();});");
        }

        public virtual SpecialString Raw(string tplCode)
        {
            return _writer.CreateRaw(tplCode);
        }

        public void WriteRaw(string tplCode)
        {
            _writer.WriteRaw(tplCode);
        }
    }
}
