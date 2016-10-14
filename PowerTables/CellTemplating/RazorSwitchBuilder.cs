using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.WebPages;

namespace PowerTables.CellTemplating
{
    public class RazorSwitchBuilder
    {
        internal readonly string _objectProperty;
        internal readonly string _defaultProperty;
        internal RazorSwitchBuilder(string expression, string objectProperty, string defaultProperty)
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
        /// <param name="content">Content to return in this particular case</param>
        /// <returns>Fluent</returns>
        public RazorSwitchBuilder When(string caseExpression, Func<object,HelperResult> content)
        {
            _lines.Add(string.Format(" case {0}: return '{1}'; ", Template.CompileExpression(caseExpression, "v", _objectProperty, _defaultProperty), content(new object())));
            return this;
        }

        /// <summary>
        /// Specifies template for single condition
        /// </summary>
        /// <param name="caseExpression">Case `{@}`-expression</param>
        /// <param name="content">Content to return in this particular case</param>
        /// <returns>Fluent</returns>
        private void When(string caseExpression, IHtmlString content)
        {
            _lines.Add(string.Format(" case {0}: return '{1}'; ", Template.CompileExpression(caseExpression, "v", _objectProperty, _defaultProperty), CellTemplating.Template.SanitizeHtmlString(content)));
        }

        /// <summary>
        /// Specifies template for default condition
        /// </summary>
        /// <param name="content">Razor template piece</param>
        /// <returns>Fluent</returns>
        public RazorSwitchBuilder Default(Func<object, HelperResult> content)
        {
            _default = string.Format(" default: return '{0}'; ", Template.SanitizeHtmlString(content(new object())));
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
        public RazorSwitchBuilder Cases<T>(IEnumerable<T> options, Func<T, string> expression, Func<T, HelperResult> template)
        {
            foreach (var option in options)
            {
                When(expression(option), template(option));
            }
            return this;
        }


        /// <summary>
        /// Default switch result will be empty string
        /// </summary>
        /// <returns>Fluent</returns>
        public RazorSwitchBuilder DefaultEmpty()
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
