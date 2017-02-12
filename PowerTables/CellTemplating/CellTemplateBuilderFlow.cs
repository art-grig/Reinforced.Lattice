using System.Collections.Generic;
using System.Text;

namespace PowerTables.CellTemplating
{
    public class CellTemplateBuilderFlow
    {
        public string ObjectProperty { get { return _objectProperty; } }

        public string DefaultProperty { get { return _defaultProperty; } }

        public IReadOnlyCollection<string> Lines { get { return _lines; } }

        private readonly List<string> _lines = new List<string>();
        private string _result;
        internal readonly string _objectProperty;
        internal readonly string _defaultProperty;

        public void Line(string line)
        {
            _lines.Add(line);
        }

        public void Result(string result)
        {
            _result = result;
        }

        /// <summary>
        /// Converts cell template fo Javascript function
        /// </summary>
        /// <returns>String containing JS function that can be run to get resulting HTML of supplied model</returns>
        public string Build()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("function (v) {");
            foreach (var line in _lines)
            {
                sb.Append(line);
            }
            if (!string.IsNullOrEmpty(_result)) sb.Append(_result);
            sb.Append("}");
            return sb.ToString();
        }

        internal CellTemplateBuilderFlow(string objectProperty = "DataObject", string defaultProperty = "Data")
        {
            _result = "return '';";
            _objectProperty = objectProperty;
            _defaultProperty = defaultProperty;
        }
    }
}
