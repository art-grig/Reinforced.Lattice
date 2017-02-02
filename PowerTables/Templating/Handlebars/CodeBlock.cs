using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.Handlebars
{
    public class CodeBlock : IDisposable, IRawProvider
    {
        private readonly IRawProvider _raw;
        private readonly string _footer;

        protected IRawProvider RawCode
        {
            get { return _raw; }
        }

        protected string Footer
        {
            get { return _footer; }
        }

        public CodeBlock(string header, string footer,IRawProvider raw)
        {
            _raw = raw;
            _raw.Raw(header);
            _footer = footer;
        }

        public void Dispose()
        {
            _raw.Raw(_footer);
        }

        void IRawProvider.Raw(string tplCode)
        {
            _raw.Raw(tplCode);
        }
    }
}
