using System;
using System.IO;

namespace PowerTables.Templating
{
    public class TemplateRegion : IDisposable
    {
        private readonly TextWriter _writer;

        public TextWriter Writer
        {
            get { return _writer; }
        }

        internal TemplateRegion(string prefix, string id, TextWriter writer)
        {
            _writer = writer;
            _writer.Write(String.Format(@"<script id=""{0}-{1}"" type=""text/x-handlebars-template""><!--", prefix, id));
        }

        public virtual void Dispose()
        {
            _writer.Write("--></script>");
        }
    }
}
