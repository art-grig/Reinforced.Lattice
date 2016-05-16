using System.Text;

namespace PowerTables.Templating
{
    /// <summary>
    /// Helper class for building IDs for filtered DOM events. 
    /// Lattice has its own event-binding mechanism called "filtered DOM events". So almost all 
    /// Lattice DOM event IDs are not regular DOM event Ids but containing additional information about event. 
    /// E.g. you may specify desired values of properties of event object and all events that does not 
    /// satisfy this condition will not be fired
    /// </summary>
    public class DOMEvent
    {
        private readonly string _baseId;
        private bool _isOut;

        private readonly StringBuilder _sb;

        /// <summary>
        /// Creates new DOMEvent filtering wrapper using base unmodified DOM event ID. 
        /// E.g. "click" or "keypress" can be passed here
        /// </summary>
        /// <param name="baseId"></param>
        public DOMEvent(string baseId)
        {
            _baseId = baseId;
            _sb = new StringBuilder();
        }

        /// <summary>
        /// Specified property (or properties) of event object should be equal to provided value
        /// </summary>
        /// <param name="value">Value to test</param>
        /// <param name="propNameAlternates">Properties of event object to be tested against provided value</param>
        /// <returns></returns>
        public DOMEvent Prop(bool value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=b`{1}`", string.Join("+", propNameAlternates), value);
            return this;
        }

        /// <summary>
        /// Specified property (or properties) of event object should be equal to provided value
        /// </summary>
        /// <param name="value">Value to test</param>
        /// <param name="propNameAlternates">Properties of event object to be tested against provided value</param>
        /// <returns></returns>
        public DOMEvent Prop(double value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=f`{1}`", string.Join("+", propNameAlternates), value.ToString("#####.#####"));
            return this;
        }

        /// <summary>
        /// Specified property (or properties) of event object should be equal to provided value
        /// </summary>
        /// <param name="value">Value to test</param>
        /// <param name="propNameAlternates">Properties of event object to be tested against provided value</param>
        /// <returns></returns>
        public DOMEvent Prop(string value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=s`{1}`", string.Join("+", propNameAlternates), value);
            return this;
        }

        /// <summary>
        /// Specified property (or properties) of event object should be equal to provided value
        /// </summary>
        /// <param name="value">Value to test</param>
        /// <param name="propNameAlternates">Properties of event object to be tested against provided value</param>
        /// <returns></returns>
        public DOMEvent Prop(int value, params string[] propNameAlternates)
        {
            _sb.AppendFormat("|{0}=i`{1}`", string.Join("+", propNameAlternates), value);
            return this;
        }

        /// <summary>
        /// Event handler will be triggered only when specefied event occured out of mentioned element's borders
        /// </summary>
        /// <param name="isOut"></param>
        /// <returns></returns>
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

        /// <summary>
        /// Implicit string conversion to make DOMEvents able to be provided everywhere string is required
        /// </summary>
        /// <param name="de">Filtered DOM event</param>
        /// <returns></returns>
        public static implicit operator string(DOMEvent de)
        {
            return de.ToString();
        }

        /// <summary>
        /// Creates new instance of filtered DOM event
        /// </summary>
        /// <param name="eventId">Native DOM event ID</param>
        /// <returns>DOM event instance</returns>
        public static DOMEvent Filter(string eventId)
        {
            return new DOMEvent(eventId);
        }
    }
}
