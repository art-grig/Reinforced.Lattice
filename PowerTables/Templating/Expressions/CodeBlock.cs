using System;
using PowerTables.Templating.Compilation;

namespace PowerTables.Templating.Expressions
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
            _raw.WriteRaw(header);
            _footer = footer;
        }

        public void Dispose()
        {
            _raw.WriteRaw(_footer);
        }

        SpecialString IRawProvider.Raw(string tplCode)
        {
            return _raw.Raw(tplCode);
        }

        public void WriteRaw(string tplCode)
        {
            _raw.WriteRaw(tplCode);
        }

        public string Variable()
        {
            return _raw.Variable();
        }

        public string Iterator()
        {
            return _raw.Iterator();
        }

        public string Key()
        {
            return _raw.Key();
        }
    }
}
