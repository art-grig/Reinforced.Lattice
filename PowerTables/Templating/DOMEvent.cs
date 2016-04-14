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

        public DOMEvent Prop(bool value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=b`{1}`", string.Join("+", propNameAlternates), value);
            return this;
        }

        public DOMEvent Prop(double value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=f`{1}`", string.Join("+", propNameAlternates), value.ToString("#####.#####"));
            return this;
        }

        public DOMEvent Prop(string value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=s`{1}`", string.Join("+", propNameAlternates), value);
            return this;
        }

        public DOMEvent Prop(int value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=i`{1}`", string.Join("+", propNameAlternates), value);
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

        public static implicit operator string(DOMEvent de)
        {
            return de.ToString();
        }

        public static DOMEvent Filter(string eventId)
        {
            return new DOMEvent(eventId);
        }
    }
}
