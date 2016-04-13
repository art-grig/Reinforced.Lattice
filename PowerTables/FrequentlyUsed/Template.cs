using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.FrequentlyUsed
{
    /// <summary>
    /// Builder for single button to be placed inside cell
    /// </summary>
    public class Template
    {
        private string _tag;
        private string _classes;
        private readonly List<string> _attributeNames = new List<string>();
        private readonly List<string> _attributeValues = new List<string>();
        private string _content;
        private readonly List<string> _ahead = new List<string>();

        /// <summary>
        /// Specifies button tag
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        public Template Tag(string tag)
        {
            _tag = tag;
            return this;
        }

        /// <summary>
        /// Specifies button tag
        /// </summary>
        /// <param name="classes">Css classes string</param>
        /// <returns></returns>
        public Template Class(string classes)
        {
            _classes = classes;
            return this;
        }

        /// <summary>
        /// Adds attribute to in-cell element
        /// </summary>
        /// <param name="attrName">Attribute name</param>
        /// <param name="attrValue">Attribute value</param>
        /// <returns></returns>
        public Template Attr(string attrName, string attrValue)
        {
            if (string.IsNullOrEmpty(attrValue)) return this;
            _attributeNames.Add(attrName);
            _attributeValues.Add(attrValue);
            return this;
        }

        /// <summary>
        /// Specifies in-element content
        /// Supports {- and `-syntax
        /// </summary>
        /// <param name="content">Raw HTML content</param>
        /// <returns></returns>
        public Template Content(string content)
        {
            _content = content; ;
            return this;
        }

        /// <summary>
        /// Specifies in-element content
        /// </summary>
        /// <param name="builder">builder action for inner element content</param>
        /// <returns></returns>
        public Template Content(Action<Template> builder)
        {
            Template b = new Template();
            builder(b);
            _content = b.Build();
            return this;
        }

        /// <summary>
        /// Specifies in-element content
        /// </summary>
        /// <param name="content">Raw HTML content</param>
        /// <returns></returns>
        public Template After(string content)
        {
            _ahead.Add(content);
            return this;
        }


        /// <summary>
        /// Specifies in-element content
        /// </summary>
        /// <param name="builder">builder action for inner element content</param>
        /// <returns></returns>
        public Template After(Action<Template> builder)
        {
            Template b = new Template();
            builder(b);
            _ahead.Add(b.Build());
            return this;
        }

        public string Build()
        {
            StringBuilder sb = new StringBuilder();
            if (!string.IsNullOrEmpty(_tag))
            {
                sb.AppendFormat("<{0}", _tag);
                if (!string.IsNullOrEmpty(_classes))
                {
                    sb.AppendFormat(" class=\"{0}\"", _classes);
                }
                for (int index = 0; index < _attributeNames.Count; index++)
                {
                    var attrName = _attributeNames[index];
                    var attrValue = _attributeValues[index];
                    sb.AppendFormat(" {0}=\"{1}\"", attrName, attrValue);
                }
                sb.AppendFormat(">{0}</{1}>", _content, _tag);
            }
            else
            {
                sb.Append(_content);
            }
            foreach (var a in _ahead)
            {
                sb.Append(a);
            }
            return sb.ToString();
        }

        public string Compile(string modelName)
        {
            return Compile(Build(), modelName);
        }

        public static string CompileExpression(string expression, string modelName)
        {
            StringBuilder sb = new StringBuilder();
            bool isOpenFieldReference = false;
            for (int i = 0; i < expression.Length; i++)
            {
                if (expression[i] == '{' && (i < expression.Length - 2 && char.IsLetter(expression[i + 1])))
                {
                    sb.AppendFormat("{0}.", modelName);
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

        public static string Compile(string templateString, string modelName)
        {
            StringBuilder sb = new StringBuilder();
            bool isOpenFieldReference = false;
            bool isOpenExpression = false;
            for (int i = 0; i < templateString.Length; i++)
            {
                if (templateString[i] == '`')
                {
                    sb.Append(isOpenExpression ? " + '" : "' + ");
                    isOpenExpression = !isOpenExpression;
                    continue;
                }

                if (templateString[i] == '\'' && !isOpenFieldReference && !isOpenExpression) sb.Append("\\\'");
                else if (templateString[i] == '{' && (i < templateString.Length - 2 && char.IsLetter(templateString[i + 1])))
                {
                    sb.AppendFormat(isOpenExpression ? "{0}." : "' + {0}.", modelName);
                    isOpenFieldReference = true;
                }
                else if (templateString[i] == '}' && isOpenFieldReference)
                {
                    if (!isOpenExpression) sb.Append(" + '");
                    isOpenFieldReference = false;
                }
                else
                {
                    sb.Append(templateString[i]);
                }
            }
            return sb.ToString();
        }

        public static string CompileDelegate(Action<Template> templateDelegate, string modelName)
        {
            Template t = new Template();
            templateDelegate(t);
            return t.Compile(modelName);
        }

        public static string BuildDelegate(Action<Template> templateDelegate)
        {
            Template t = new Template();
            templateDelegate(t);
            return t.Build();
        }
    }
}
