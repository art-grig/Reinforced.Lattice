using System;

namespace PowerTables.CellTemplating
{
    /// <summary>
    /// Class used to build buttons to be output inside cell
    /// </summary>
    public class CellTemplateBuilder
    {
        public CellTemplateBuilderFlow Flow { get; private set; }

        /// <summary>
        /// Creates new instance of Cell template builder
        /// </summary>
        /// <param name="objectProperty"></param>
        /// <param name="defaultProperty"></param>
        public CellTemplateBuilder(string objectProperty = "DataObject", string defaultProperty = "Data")
        {
            Flow = new CellTemplateBuilderFlow(objectProperty,defaultProperty);
        }

        #region Flow control
        public CellTemplateBuilder FlowIf(string expression, Action<CellTemplateBuilder> @if, Action<CellTemplateBuilder> @else = null)
        {
            Flow.Line(string.Format("if ({0}) {{ ", Template.CompileExpression(expression, "v", Flow.ObjectProperty, Flow.DefaultProperty)));
            @if(this);
            if (@else != null)
            {
                Flow.Line("} else { ");
                @else(this);
            }
            Flow.Line("}");
            return this;
        }

        public CellTemplateBuilder FlowIfNotPresent(string expression, Action<CellTemplateBuilder> @if, Action<CellTemplateBuilder> @else = null)
        {
            Flow.Line(string.Format("if ((({0})==null)||(({0})==undefined)) {{ ", Template.CompileExpression(expression, "v", Flow.ObjectProperty, Flow.DefaultProperty)));
            @if(this);
            if (@else != null)
            {
                Flow.Line("} else { ");
                @else(this);
            }
            Flow.Line("}");
            return this;
        }

        public CellTemplateBuilder FlowReturns(string content)
        {
            var text = Template.Compile(content, "v", Flow.ObjectProperty, Flow.DefaultProperty);
            Flow.Line(text);
            return this;
        }
        #endregion

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
            expression = Template.CompileExpression(expression, "v", Flow.ObjectProperty, Flow.DefaultProperty);
            Flow.Line(string.Format("if ((({0})==null)||(({0})==undefined)) return {1}; "
                , expression
                , Template.Compile(content, "v", Flow.ObjectProperty, Flow.DefaultProperty)));
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
            expression = Template.CompileExpression(expression, "v", Flow.ObjectProperty, Flow.DefaultProperty);
            Flow.Line(string.Format("if ((({0})==null)||(({0})==undefined)) return {1}; "
                , expression
                , Template.CompileDelegate(content, "v", Flow.ObjectProperty, Flow.DefaultProperty)));
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
            Flow.Line(string.Format("if ({0}) return ''; ", Template.CompileExpression(expression, "v", Flow.ObjectProperty, Flow.DefaultProperty)));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, string content)
        {
            Flow.Line(string.Format("if ({0}) return {1}; ", Template.CompileExpression(expression, "v", Flow.ObjectProperty, Flow.DefaultProperty), Template.Compile(content, "v", Flow.ObjectProperty, Flow.DefaultProperty)));
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
            Flow.Line(string.Format("if ({0}) {{ return {1}; }} else {{ return {2};}} ",
                Template.CompileExpression(expression, "v", Flow.ObjectProperty, Flow.DefaultProperty),
                Template.Compile(positiveContent, "v", Flow.ObjectProperty, Flow.DefaultProperty),
                Template.Compile(negativeContent, "v", Flow.ObjectProperty, Flow.DefaultProperty)));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public CellTemplateBuilder Returns(string content)
        {
            var text = Template.Compile(content, "v", Flow.ObjectProperty, Flow.DefaultProperty);
            Flow.Result(string.Format("return {0}; ", text));
            return this;
        }

        /// <summary>
        /// Converts cell template fo Javascript function
        /// </summary>
        /// <returns>String containing JS function that can be run to get resulting HTML of supplied model</returns>
        public string Build()
        {
            return Flow.Build();
        }
    }
}
