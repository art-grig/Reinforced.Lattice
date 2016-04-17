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
        internal SwitchBuilder(string expression)
        {
            _expression = expression;
        }

        private readonly string _expression;
        private readonly List<string> _lines = new List<string>();
        private string _default = null;

        public SwitchBuilder When(string caseExpression, Action<Template> template)
        {
            Template tpl = new Template();
            template(tpl);
            _lines.Add(string.Format(" case {0}: return {1}; ", Template.CompileExpression(caseExpression, "v", Template.DefaultObjectProperty), tpl.Compile("v", Template.DefaultObjectProperty)));
            return this;
        }

        public SwitchBuilder Default(Action<Template> template)
        {
            Template tpl = new Template();
            template(tpl);
            _default = string.Format(" default: return {0}; ", tpl.Compile("v", Template.DefaultObjectProperty));
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
                _lines.Add(string.Format(" case {0}: return {1}; ", Template.CompileExpression(expression(option), "v", Template.DefaultObjectProperty), tpl.Compile("v", Template.DefaultObjectProperty)));
            }
            return this;
        }

        public string Build()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("switch ({0}) {{", Template.CompileExpression(_expression, "v", Template.DefaultObjectProperty));
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
