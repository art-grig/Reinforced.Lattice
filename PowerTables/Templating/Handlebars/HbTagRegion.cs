using System;
using System.IO;
using System.Text;
using System.Web.Mvc;

namespace PowerTables.Templating.Handlebars
{
    public class HbTagRegion : IDisposable
    {
        private readonly TextWriter _writer;
        private readonly string _tag;
        private readonly bool _inline;
        private readonly string _args;

        public TextWriter Writer
        {
            get { return _writer; }
        }

        public string Tag
        {
            get { return _tag; }
        }

        internal HbTagRegion(string tag, string args, TextWriter writer)
        {
            _writer = writer;
            _writer.Write("{{#");
            _writer.Write(String.Format(@"{0} {1}", tag, args));
            _writer.Write("}}");
            _tag = tag;
            _args = args;
        }

        internal HbTagRegion(string tag, string args)
        {
            _inline = true;
            _tag = tag;
            _args = args;
        }

        public MvcHtmlString Render(string content)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("{{#");
            sb.AppendFormat(@"{0} {1}", _tag, _args);
            sb.Append("}} ");
            sb.Append(content);
            sb.Append(" {{/");
            sb.Append(_tag);
            sb.Append("}}");
            return MvcHtmlString.Create(sb.ToString());
        }

        public void Dispose()
        {
            if (_inline) return;
            _writer.Write("{{/");
            _writer.Write(_tag);
            _writer.Write("}}");
        }
    }
}
