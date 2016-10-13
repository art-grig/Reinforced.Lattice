using System;
using System.Collections.Generic;
using System.Text;
using System.Web;

namespace PowerTables.CellTemplating
{
    /// <summary>
    /// Class used to build buttons to be output inside cell
    /// </summary>
    public class CellTemplateBuilder : IHtmlString
    {
        private readonly List<string> _lines = new List<string>();
        private string _result;
        internal readonly string _objectProperty;
        internal readonly string _defaultProperty;

        /// <summary>
        /// Creates new instance of Cell template builder
        /// </summary>
        /// <param name="objectProperty"></param>
        /// <param name="defaultProperty"></param>
        public CellTemplateBuilder(string objectProperty = "DataObject",string defaultProperty = "Data")
        {
            _result = "return '';";
            _objectProperty = objectProperty;
            _defaultProperty = defaultProperty;
        }

        /// <summary>
        /// Template will return empty cell is specified column is null or 0 or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <returns></returns>
        public CellTemplateBuilder EmptyIfNotPresent(string expression)
        {
            return IfNotPresent(expression, string.Empty);
        }

        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder IfNotPresent(string expression, string content)
        {
            expression = Template.CompileExpression(expression, "v", _objectProperty, _defaultProperty);
            _lines.Add(string.Format("if ((({0})==null)||(({0})==undefined)) return {1}; "
                , expression
                , Template.Compile(content, "v", _objectProperty,_defaultProperty)));
            return this;
        }

        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder IfNotPresent(string expression, Action<Template> content)
        {
            expression = Template.CompileExpression(expression, "v", _objectProperty, _defaultProperty);
            _lines.Add(string.Format("if ((({0})==null)||(({0})==undefined)) return {1}; "
                , expression
                , Template.CompileDelegate(content, "v", _objectProperty, _defaultProperty)));
            return this;
        }

        /// <summary>
        /// Template will return empty cell is specified expression met. 
        /// Feel free to use {@}-syntax here 
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <returns></returns>
        public CellTemplateBuilder EmptyIf(string expression)
        {
            _lines.Add(string.Format("if ({0}) return ''; ", Template.CompileExpression(expression, "v", _objectProperty,_defaultProperty)));
            return this;
        }

        internal void Line(string line)
        {
            _lines.Add(line);
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, string content)
        {
            _lines.Add(string.Format("if ({0}) return {1}; ", Template.CompileExpression(expression, "v", _objectProperty, _defaultProperty), Template.Compile(content, "v", _objectProperty, _defaultProperty)));
            return this;
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
            _lines.Add(string.Format("if ({0}) {{ return {1}; }} else {{ return {2};}} ",
                Template.CompileExpression(expression, "v", _objectProperty, _defaultProperty),
                Template.Compile(positiveContent, "v", _objectProperty, _defaultProperty),
                Template.Compile(negativeContent, "v", _objectProperty, _defaultProperty)));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder Returns(string content)
        {
            var text = Template.Compile(content, "v", _objectProperty, _defaultProperty);
            _result = string.Format("return {0}; ", text);
            return this;
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

        public string ToHtmlString()
        {
            return string.Empty;
        }
    }
}
