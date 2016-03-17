using System;
using System.Collections.Generic;
using System.Linq;
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
            _lines.Add(string.Format("if (!v.{0}) return '';", columnName));
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
            _lines.Add(string.Format("if ({0}) return '';", ConvertParenthesis(expression)));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, Action<TemplateElementBuilder> elment)
        {
            TemplateElementBuilder e = new TemplateElementBuilder();
            elment(e);
            var text = ConvertParenthesisToConcat(e.Build());
            _lines.Add(string.Format("if ({0}) return '{1}';", ConvertParenthesis(expression), text));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="elment">Element builder delegate</param>
        /// <param name="elseElment">What to return if condition not met</param>
        /// <returns></returns>
        public CellTemplateBuilder ReturnsIf(string expression, Action<TemplateElementBuilder> elment, Action<TemplateElementBuilder> elseElment)
        {
            TemplateElementBuilder e = new TemplateElementBuilder();
            elment(e);
            var textIf = ConvertParenthesisToConcat(e.Build());

            TemplateElementBuilder ee = new TemplateElementBuilder();
            elseElment(ee);
            var textElse = ConvertParenthesisToConcat(ee.Build());
            _lines.Add(string.Format("if ({0}) {{ return '{1}'; }} else {{ return '{2}';}}", ConvertParenthesis(expression), textIf, textElse));
            return this;
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="elment">Element builder delegate</param>
        /// <returns></returns>
        public CellTemplateBuilder Returns(Action<TemplateElementBuilder> elment)
        {
            TemplateElementBuilder e = new TemplateElementBuilder();
            elment(e);
            var text = ConvertParenthesisToConcat(e.Build());
            _result = string.Format("return '{0}';", text);
            return this;
        }

        private string ConvertParenthesis(string expression)
        {
            StringBuilder sb = new StringBuilder();
            bool isOpenQuote = false;
            for (int i = 0; i < expression.Length; i++)
            {
                if (expression[i] == '{' && (i < expression.Length - 2 && char.IsLetter(expression[i + 1])))
                {
                    sb.Append("v.");
                    isOpenQuote = true;
                }
                else if (expression[i] == '}' && isOpenQuote)
                {
                    isOpenQuote = false;
                }
                else
                {
                    sb.Append(expression[i]);
                }
            }
            return sb.ToString();
        }

        private string ConvertParenthesisToConcat(string expression)
        {
            StringBuilder sb = new StringBuilder();
            bool isOpenQuote = false;
            for (int i = 0; i < expression.Length; i++)
            {
                if (expression[i] == '\'') sb.Append("\\\'");
                else if (expression[i] == '{' && (i < expression.Length - 2 && char.IsLetter(expression[i + 1])))
                {
                    sb.Append("' + v.");
                    isOpenQuote = true;
                }
                else if (expression[i] == '}' && isOpenQuote)
                {
                    sb.Append(" + '");
                    isOpenQuote = false;
                }
                else
                {
                    sb.Append(expression[i]);
                }
            }
            return sb.ToString();
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
