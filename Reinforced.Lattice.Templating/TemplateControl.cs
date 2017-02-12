using System;
using System.IO;

namespace Reinforced.Lattice.Templating
{
    public sealed class TemplateControl
    {
        private readonly Func<TextWriter> _outGetter;

        public TemplateControl(Func<TextWriter> outGetter)
        {
            _outGetter = outGetter;
        }

        internal TextWriter Out
        {
            get { return _outGetter(); }
        }

        internal bool CrunchingTemplate { get; set; }
    }
}
