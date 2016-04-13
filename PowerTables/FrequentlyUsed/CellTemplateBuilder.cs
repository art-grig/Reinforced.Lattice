using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.FrequentlyUsed
{
    /// <summary>
    /// Class used to build buttons to be output inside cell
    /// </summary>
    public class CellTemplateBuilder
    {
        private readonly List<string> _lines = new List<string>();
        private string _result;

        public CellTemplateBuilder()
        {
            _result = "return '';";
        }

        /// <summary>
        /// Template will return empty cell is specified column is null or 0 or undefined
        /// </summary>
        /// <param name="columnName">Column</param>
        /// <returns></returns>
        public CellTemplateBuilder EmptyIfNotPresent(string columnName)
        {
            _lines.Add(string.Format("if ((v.{0}==null)||(v.{0}==undefined)) return '';", columnName));
            return this;
        }

        /// <summary>
        /// Template will return empty cell is specified expression met. 
        /// Feel free to use {Something} syntax here where Something is one of 
        /// raw column names
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <returns></returns>
        public CellTemplateBuilder EmptyIf(string expression)
        {
            _lines.Add(string.Format("if ({0}) return '';", Template.CompileExpression(expression, "v")));
            return this;
        }

        /// <summary>
        /// Adds switch Switch operator to templating function
        /// </summary>
        /// <param name="expression">Expression to switch</param>
        /// <param name="swtch">Switch builder action</param>
        /// <returns></returns>
        public CellTemplateBuilder Switch(string expression, Action<SwitchBuilder> swtch)
        {
            SwitchBuilder swb = new SwitchBuilder(expression);
            swtch(swb);
            _lines.Add(swb.Build());
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, Action<Template> elment)
        {
            return ReturnsIf(expression, Template.BuildDelegate(elment));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="text">Text to return</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, string text)
        {
            _lines.Add(string.Format("if ({0}) return '{1}';", Template.CompileExpression(expression, "v"), Template.Compile(text, "v")));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <param name="elseElment">What to return if condition not met</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, Action<Template> elment, Action<Template> elseElment)
        {
            return ReturnsIf(expression, Template.BuildDelegate(elment), Template.BuildDelegate(elseElment));
        }


        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, string positiveContent, string negativeContent)
        {
            _lines.Add(string.Format("if ({0}) {{ return '{1}'; }} else {{ return '{2}';}}",
                Template.CompileExpression(expression, "v"),
                Template.Compile(positiveContent, "v"),
                Template.Compile(negativeContent, "v")));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public CellTemplateBuilder Returns(Action<Template> elment)
        {
            return Returns(Template.BuildDelegate(elment));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder Returns(string content)
        {
            var text = Template.Compile(content, "v");
            _result = string.Format("return '{0}';", text);
            return this;
        }

        internal string Build()
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
    }
}
