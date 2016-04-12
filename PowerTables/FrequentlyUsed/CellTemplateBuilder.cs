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
            _lines.Add(string.Format("if (!v.{0}) return '';", columnName));
            return this;
        }

        /// <summary>
        /// Template will return empty cell is specified column is null or 0 or undefined
        /// </summary>
        /// <param name="columnName">Column</param>
        /// <returns></returns>
        public CellTemplateBuilder EmptyIfNotPresentSelf()
        {
            _lines.Add("if (!v) return '';");
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
            _lines.Add(string.Format("if ({0}) return '';", ConvertSimpleExpression(expression)));
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
            _lines.Add(string.Format("if ({0}) return '{1}';", ConvertSimpleExpression(expression), text));
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
            _lines.Add(string.Format("if ({0}) {{ return '{1}'; }} else {{ return '{2}';}}", ConvertSimpleExpression(expression), textIf, textElse));
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

        private static bool IsValidToken(char token)
        {
            return char.IsLetter(token) || token == '@';
        }

        private static bool IsSelfReference(char token)
        {
            return token == '@';
        }

        private static string ConvertSimpleExpression(string expression)
        {
            StringBuilder sb = new StringBuilder();
            bool isOpenFieldReference = false;
            for (int i = 0; i < expression.Length; i++)
            {
                if (expression[i] == '{' && (i < expression.Length - 2 && IsValidToken(expression[i + 1])))
                {
                    sb.Append(IsSelfReference(expression[i + 1]) ? "v" : "v.");
                    i++;
                    isOpenFieldReference = true;
                }
                else if (expression[i] == '}' && isOpenFieldReference)
                {
                    isOpenFieldReference = false;
                }
                else
                {
                    sb.Append(expression[i]);
                }
            }
            return sb.ToString();
        }

        private static string ConvertParenthesisToConcat(string expression)
        {
            StringBuilder sb = new StringBuilder();
            bool isOpenFieldReference = false;
            bool isOpenExpression = false;
            for (int i = 0; i < expression.Length; i++)
            {
                if (expression[i] == '`')
                {
                    if (isOpenExpression)
                    {
                        sb.Append(" + '");
                    }
                    else
                    {
                        sb.Append("' + ");
                    }
                    isOpenExpression = !isOpenExpression;
                    continue;
                }

                if (expression[i] == '\'' && !isOpenFieldReference && !isOpenExpression) sb.Append("\\\'");
                else if (expression[i] == '{' && (i < expression.Length - 2 && IsValidToken(expression[i + 1])))
                {
                    if (isOpenExpression) sb.Append("v");
                    else sb.Append("' + v");
                    if (IsSelfReference(expression[i + 1])) i++;
                    else sb.Append(".");
                    isOpenFieldReference = true;
                }
                else if (expression[i] == '}' && isOpenFieldReference)
                {
                    if (!isOpenExpression) sb.Append(" + '");
                    isOpenFieldReference = false;
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
