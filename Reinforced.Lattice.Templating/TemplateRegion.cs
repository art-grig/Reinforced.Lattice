using System;
using Reinforced.Lattice.Templating.Compilation;

namespace Reinforced.Lattice.Templating
{
    public class TemplateRegion : DeclaratorBase, IDisposable, ITemplateRegion
    {
        private readonly ScopedWriter _writer;
        private readonly ITemplatesScope _scope;
        public TemplateRegionType Type { get; protected set; }

        public TemplateRegion(TemplateRegionType type, string prefix, string id, ITemplatesScope scope)
        {
            _writer = (ScopedWriter)scope.Flow.Out;
            _scope = scope;
            Type = type;
            _writer.Write(string.Format(";PowerTables.Templating._ltcTpl._('{0}','{1}',function(o,d,w,p,s){{p.d(o,{2});", prefix, id, (int)type));
            scope.Flow.CrunchingTemplate = true;
        }

        public virtual void Dispose()
        {
            _scope.Flow.CrunchingTemplate = false;
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
