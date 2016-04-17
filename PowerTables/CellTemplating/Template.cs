using System;
using System.Collections.Generic;
using System.Text;

namespace PowerTables.CellTemplating
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
        public const string DefaultObjectProperty = "DataObject";

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

        public Template Data(string dataName, string dataValue)
        {
            return Attr("data-" + dataName, dataValue);
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

        public string Compile(string modelName,string objectProperty)
        {
            return Compile(Build(), modelName,objectProperty);
        }

        public static string CompileExpression(string expression, string modelName, string objectProperty)
        {
            StringBuilder sb = new StringBuilder();
            CrunchExpression(expression, modelName, objectProperty, sb, 0);
            return sb.ToString();
        }

        private static int CrunchExpression(string tpl, string modelName, string objectProperty, StringBuilder sb,
            int beginIndex)
        {
            for (int i = beginIndex; i < tpl.Length; i++)
            {
                if (tpl[i] == '`') return i;

                if (tpl[i] == '{' && (i < tpl.Length - 2 && IsValidToken(tpl[i + 1])))
                {
                    i = CrunchFieldReference(tpl, modelName, objectProperty, sb, i + 1);
                    continue;
                }
                sb.Append(tpl[i]);
            }
            return tpl.Length;
        }

        private static int CrunchFieldReference(string tpl, string modelName, string objectProperty, StringBuilder sb, int i)
        {
            sb.Append(modelName);
            if (tpl[i] == '@' && tpl[i + 1] == '}') return i + 1;
            if (tpl[i] == '^')
            {
                sb.Append('.');
                i++;
            }
            else sb.AppendFormat(".{0}.", objectProperty);

            for (; i < tpl.Length; i++)
            {
                if (tpl[i] == '}') 
                    return i;
                sb.Append(tpl[i]);
            }
            return i;
        }
        private static bool IsValidToken(char token)
        {
            return char.IsLetter(token) || token == '@' || token == '^';
        }

        public static string Compile(string tpl, string modelName, string objectProperty)
        {
            StringBuilder sb = new StringBuilder();

            if (tpl[0] != '`' && tpl[0] != '{') sb.Append("'");

            for (int i = 0; i < tpl.Length; i++)
            {


                if (tpl[i] == '`')
                {
                    if (i > 0) sb.Append("' +");
                    i = CrunchExpression(tpl, modelName,objectProperty, sb, i + 1);
                    if (i < tpl.Length - 1) sb.Append("+ '");
                    continue;
                }

                if (tpl[i] == '{' && IsValidToken(tpl[i + 1]))
                {
                    if (i > 0) sb.Append("' +");
                    i = CrunchFieldReference(tpl, modelName, objectProperty, sb, i + 1);
                    if (i < tpl.Length - 1) sb.Append("+ '");
                    continue;
                }
                if (tpl[i] == '\'') sb.Append("\\\'");
                else sb.Append(tpl[i]);
            }

            if (tpl[tpl.Length - 1] != '`' && tpl[tpl.Length - 1] != '}')
                sb.Append("'");
            return sb.ToString();
        }

        public static string CompileDelegate(Action<Template> templateDelegate, string modelName, string objectProperty)
        {
            Template t = new Template();
            templateDelegate(t);
            return t.Compile(modelName, objectProperty);
        }

        public static string BuildDelegate(Action<Template> templateDelegate)
        {
            Template t = new Template();
            templateDelegate(t);
            return t.Build();
        }
    }
}
