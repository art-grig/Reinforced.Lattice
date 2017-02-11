using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating
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
