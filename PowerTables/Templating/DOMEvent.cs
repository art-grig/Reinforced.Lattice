using System;
using System.Text;

namespace PowerTables.Templating
{
    public class DOMEvent
    {
        private readonly string _baseId;
        private bool _isOut;

        private readonly StringBuilder _sb;

        public DOMEvent(string baseId)
        {
            _baseId = baseId;
            _sb = new StringBuilder();
        }

        public DOMEvent Prop(string propName, bool value)
        {
            _sb.AppendFormat("|{0}=b`{1}`", propName, value);
            return this;
        }

        public DOMEvent Prop(string propName, double value)
        {
            _sb.AppendFormat("|{0}=f`{1}`", propName, value.ToString("#####.#####"));
            return this;
        }

        public DOMEvent Prop(string propName, string value)
        {
            _sb.AppendFormat("|{0}=s`{1}`", propName, value);
            return this;
        }

        public DOMEvent Prop(string propName, int value)
        {
            _sb.AppendFormat("|{0}=i`{1}`", propName, value);
            return this;
        }

        public DOMEvent Out(bool isOut = true)
        {
            _isOut = isOut;
            return this;
        }

        public override string ToString()
        {
            _sb.AppendFormat("|{0}", _baseId);
            if (_isOut)
            {
                return "out-" + _sb;
            }
            return _sb.ToString();
        }

        public static DOMEvent Filter(string eventId)
        {
            return new DOMEvent(eventId);
        }
    }
}
