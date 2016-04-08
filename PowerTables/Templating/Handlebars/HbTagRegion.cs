using System;
using System.IO;

namespace PowerTables.Templating.Handlebars
{
    public class HbTagRegion: IDisposable
    {
        private readonly TextWriter _writer;
        private readonly string _tag;

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
            _writer.Write("{{");
            _writer.Write(String.Format(@"{0} {1}",tag,args));
            _writer.Write("}}");
            _tag = tag;
        }

        public void Dispose()
        {
            _writer.Write("{{/");
            _writer.Write(_tag);
            _writer.Write("}}");
        }
    }
}
