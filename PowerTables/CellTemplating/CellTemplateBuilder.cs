using System;
using System.Collections.Generic;
using System.Text;

namespace PowerTables.CellTemplating
{
    /// <summary>
    /// Class used to build buttons to be output inside cell
    /// </summary>
    public class CellTemplateBuilder
    {
        private readonly List<string> _lines = new List<string>();
        private string _result;
        private readonly string _objectProperty;

        /// <summary>
        /// Creates new instance of Cell template builder
        /// </summary>
        /// <param name="objectProperty"></param>
        public CellTemplateBuilder(string objectProperty = "DataObject")
        {
            _result = "return '';";
            _objectProperty = objectProperty;
        }

        /// <summary>
        /// Template will return empty cell is specified column is null or 0 or undefined
        /// </summary>
        /// <param name="columnName">Column</param>
        /// <returns></returns>
        public CellTemplateBuilder EmptyIfNotPresent(string columnName)
        {
            _lines.Add(string.Format("if ((v{1}.{0}==null)||(v{1}.{0}==undefined)) return ''; ", columnName, string.IsNullOrEmpty(_objectProperty) ? string.Empty : ".DataObject"));
            return this;
        }
        /// <summary>
        /// Template will return empty cell is self-value ({@}) is null or undefined
        /// </summary>
        /// <returns></returns>
        public CellTemplateBuilder EmptyIfNotPresentSelf()
        {
            _lines.Add(String.Format("if ((v{0}==null)||(v{0}==undefined)) return \'\'; ", string.IsNullOrEmpty(_objectProperty) ? string.Empty : ".DataObject"));
            return this;
        }


        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="columnName">Column</param>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder IfNotPresent(string columnName, string content)
        {
            _lines.Add(string.Format("if ((v{1}.{0}==null)||(v{1}.{0}==undefined)) return {2}; "
                , columnName
                , string.IsNullOrEmpty(_objectProperty) ? string.Empty : ".DataObject"
                , Template.Compile(content, "v", _objectProperty)));
            return this;
        }


        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="columnName">Column</param>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder IfNotPresent(string columnName, Action<Template> content)
        {
            _lines.Add(string.Format("if ((v{1}.{0}==null)||(v{1}.{0}==undefined)) return {2}; "
                , columnName
                , string.IsNullOrEmpty(_objectProperty) ? string.Empty : ".DataObject"
                , Template.CompileDelegate(content, "v", _objectProperty)));
            return this;
        }

        /// <summary>
        /// Template will return empty cell is self-value ({@}) is null or undefined
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder IfNotPresentSelf(string content)
        {
            _lines.Add(String.Format("if ((v{0}==null)||(v{0}==undefined)) return {1}; "
                , string.IsNullOrEmpty(_objectProperty) ? string.Empty : ".DataObject"
                , Template.Compile(content, "v", _objectProperty)));
            return this;
        }

        /// <summary>
        /// Template will return empty cell is self-value ({@}) is null or undefined
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder IfNotPresentSelf(Action<Template> content)
        {
            _lines.Add(String.Format("if ((v{0}==null)||(v{0}==undefined)) return {1}; "
                , string.IsNullOrEmpty(_objectProperty) ? string.Empty : ".DataObject"
                , Template.CompileDelegate(content, "v", _objectProperty)));
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
            _lines.Add(string.Format("if ({0}) return ''; ", Template.CompileExpression(expression, "v", _objectProperty)));
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
            SwitchBuilder swb = new SwitchBuilder(expression, _objectProperty);
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
            _lines.Add(string.Format("if ({0}) return {1}; ", Template.CompileExpression(expression, "v", _objectProperty), Template.Compile(text, "v", _objectProperty)));
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
            _lines.Add(string.Format("if ({0}) {{ return {1}; }} else {{ return {2};}} ",
                Template.CompileExpression(expression, "v", _objectProperty),
                Template.Compile(positiveContent, "v", _objectProperty),
                Template.Compile(negativeContent, "v", _objectProperty)));
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
            var text = Template.Compile(content, "v", _objectProperty);
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
    }
}
