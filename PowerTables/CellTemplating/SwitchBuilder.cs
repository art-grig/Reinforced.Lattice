using System;
using System.Collections.Generic;
using System.Text;

namespace PowerTables.CellTemplating
{
    /// <summary>
    /// Builds switch for template
    /// </summary>
    public class SwitchBuilder
    {
        private readonly string _objectProperty;
        private readonly string _defaultProperty;
        internal SwitchBuilder(string expression,string objectProperty,string defaultProperty)
        {
            _expression = expression;
            _objectProperty = objectProperty;
            _defaultProperty = defaultProperty;
        }

        private readonly string _expression;
        private readonly List<string> _lines = new List<string>();
        private string _default;

        /// <summary>
        /// Specifies template for single condition
        /// </summary>
        /// <param name="caseExpression">Case `{@}`-expression</param>
        /// <param name="template">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public SwitchBuilder When(string caseExpression, Action<Template> template)
        {
            Template tpl = new Template();
            template(tpl);
            _lines.Add(string.Format(" case {0}: return {1}; ", Template.CompileExpression(caseExpression, "v", _objectProperty, _defaultProperty), tpl.Compile("v", _objectProperty, _defaultProperty)));
            return this;
        }

        /// <summary>
        /// Specifies template for default condition
        /// </summary>
        /// <param name="template">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public SwitchBuilder Default(Action<Template> template)
        {
            Template tpl = new Template();
            template(tpl);
            _default = string.Format(" default: return {0}; ", tpl.Compile("v", _objectProperty, _defaultProperty));
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
        /// Specifies template builders for several cases
        /// </summary>
        /// <typeparam name="T">Case option element type</typeparam>
        /// <param name="options">Set of available options for cases</param>
        /// <param name="expression">Case `{@}`-expression builder for every option</param>
        /// <param name="template">Template builder for every option</param>
        /// <returns></returns>
        public SwitchBuilder Cases<T>(IEnumerable<T> options, Func<T, string> expression,
            Action<Template, T> template)
        {
            foreach (var option in options)
            {
                Template tpl = new Template();
                template(tpl, option);
                _lines.Add(string.Format(" case {0}: return {1}; ", Template.CompileExpression(expression(option), "v", _objectProperty, _defaultProperty), tpl.Compile("v", _objectProperty, _defaultProperty)));
            }
            return this;
        }

        /// <summary>
        /// Converts this switch builder to target piece of JS code
        /// </summary>
        /// <returns>JS code for embedding into template function</returns>
        public string Build()
        {
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
