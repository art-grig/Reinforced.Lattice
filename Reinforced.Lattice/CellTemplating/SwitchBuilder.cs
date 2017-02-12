using System;
using System.Collections.Generic;
using System.Text;

namespace Reinforced.Lattice.CellTemplating
{
    /// <summary>
    /// Builds switch for template
    /// </summary>
    public class SwitchBuilder
    {
        internal readonly string _objectProperty;
        internal readonly string _defaultProperty;
        internal SwitchBuilder(string expression, string objectProperty, string defaultProperty)
        {
            _expression = expression;
            _objectProperty = objectProperty;
            _defaultProperty = defaultProperty;
        }

        internal SwitchBuilder(string objectProperty, string defaultProperty)
        {
            _objectProperty = objectProperty;
            _defaultProperty = defaultProperty;
        }

        private string _expression;
        private readonly List<string> _lines = new List<string>();
        private string _default;

        /// <summary>
        /// Specifies expression under switch
        /// </summary>
        /// <param name="expression">Expression to switch by</param>
        /// <returns>Fluent</returns>
        public SwitchBuilder By(string expression)
        {
            _expression = expression;
            return this;
        }

        /// <summary>
        /// Specifies template for single condition
        /// </summary>
        /// <param name="caseExpression">Case `{@}`-expression</param>
        /// <param name="content">Content to return in this particular case</param>
        /// <returns>Fluent</returns>
        public SwitchBuilder When(string caseExpression, string content)
        {
            _lines.Add(string.Format(" case {0}: return {1}; ", Template.CompileExpression(caseExpression, "v", _objectProperty, _defaultProperty), content));
            return this;
        }

        /// <summary>
        /// Specifies template for default condition
        /// </summary>
        /// <param name="template">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public SwitchBuilder Default(string content)
        {
            _default = string.Format(" default: return {0}; ", content);
            return this;
        }

        /// <summary>
        /// Default switch result will be empty string
        /// </summary>
        /// <returns>Fluent</returns>
        public SwitchBuilder DefaultEmpty()
        {
            _default = " default: return ''; ";
            return this;
        }

        /// <summary>
        /// Converts this switch builder to target piece of JS code
        /// </summary>
        /// <returns>JS code for embedding into template function</returns>
        public string Build()
        {
            if (string.IsNullOrEmpty(_expression)) throw new Exception("Switch needs expression. Please call .By() to obtain correct switch");
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("switch ({0}) {{", Template.CompileExpression(_expression, "v", _objectProperty, _defaultProperty));
            foreach (var line in _lines)
            {
                sb.Append(line);
            }
            sb.Append(_default);
            sb.Append("} ");
            return sb.ToString();
        }

    }
}
