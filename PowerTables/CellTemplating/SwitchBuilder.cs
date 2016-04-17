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
        private string _objectProperty;
        internal SwitchBuilder(string expression,string objectProperty)
        {
            _expression = expression;
            _objectProperty = objectProperty;
        }

        private readonly string _expression;
        private readonly List<string> _lines = new List<string>();
        private string _default = null;

        public SwitchBuilder When(string caseExpression, Action<Template> template)
        {
            Template tpl = new Template();
            template(tpl);
            _lines.Add(string.Format(" case {0}: return {1}; ", Template.CompileExpression(caseExpression, "v", _objectProperty), tpl.Compile("v", _objectProperty)));
            return this;
        }

        public SwitchBuilder Default(Action<Template> template)
        {
            Template tpl = new Template();
            template(tpl);
            _default = string.Format(" default: return {0}; ", tpl.Compile("v", _objectProperty));
            return this;
        }

        public SwitchBuilder DefaultEmpty()
        {
            _default = " default: return ''; ";
            return this;
        }

        public SwitchBuilder Cases<T>(IEnumerable<T> options, Func<T, string> expression,
            Action<Template, T> template)
        {
            foreach (var option in options)
            {
                Template tpl = new Template();
                template(tpl, option);
                _lines.Add(string.Format(" case {0}: return {1}; ", Template.CompileExpression(expression(option), "v", _objectProperty), tpl.Compile("v", _objectProperty)));
            }
            return this;
        }

        public string Build()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("switch ({0}) {{", Template.CompileExpression(_expression, "v", _objectProperty));
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
