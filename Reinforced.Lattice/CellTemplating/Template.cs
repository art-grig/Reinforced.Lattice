﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Reinforced.Lattice.CellTemplating
{
    /// <summary>
    /// Builder for single button to be placed inside cell
    /// </summary>
    public class Template
    {
        private string _tag;
        private readonly List<string> _classes = new List<string>();
        private readonly Dictionary<string, string> _attributes = new Dictionary<string, string>();
        private readonly Dictionary<string, string> _styles = new Dictionary<string, string>();
        private string _content;
        private readonly List<string> _ahead = new List<string>();
        private readonly string _overrideString;

        public Template()
        {
        }

        internal Template(string overrideString)
        {
            _overrideString = overrideString;
        }
        
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
            _classes.AddRange(classes.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries));
            return this;
        }

        /// <summary>
        /// Specifies button tag
        /// </summary>
        /// <param name="classes">Css classes string</param>
        /// <returns></returns>
        public Template RemoveClass(string classes)
        {
            var classesArr = classes.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            _classes.RemoveAll(c => classesArr.Contains(c));
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
            _attributes[attrName] = attrValue;
            return this;
        }

        /// <summary>
        /// Changes/updates specified data-attribute of resulting tag
        /// </summary>
        /// <param name="dataName">data name</param>
        /// <param name="dataValue">data value</param>
        /// <returns></returns>
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
            _content = content;
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

        /// <summary>
        /// Changes specified style of element
        /// </summary>
        /// <param name="styleKey">CSS style namt</param>
        /// <param name="styleValue">CSS style value</param>
        /// <returns></returns>
        public Template Css(string styleKey, string styleValue)
        {
            _styles[styleKey] = styleValue;
            return this;
        }

       

        /// <summary>
        /// Builds template into plain HTML strin with `{@}`-placeholders
        /// </summary>
        /// <returns>Built template</returns>
        public string Build()
        {
            if (!string.IsNullOrEmpty(_overrideString)) return _overrideString;

            StringBuilder sb = new StringBuilder();
            if (!string.IsNullOrEmpty(_tag))
            {
                sb.AppendFormat("<{0}", _tag);
                if (_classes.Count > 0)
                {
                    sb.AppendFormat(" class=\"{0}\"", string.Join(" ", _classes.ToArray()));
                }
                foreach (var attribute in _attributes)
                {
                    sb.AppendFormat(" {0}=\"{1}\"", attribute.Key, attribute.Value);
                }
                if (_styles.Count > 0)
                {
                    sb.AppendFormat(" style=\"{0}\"", string.Join(";", _styles.Select(c => string.Format("{0}:{1}", c.Key, c.Value)).ToArray()));
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

        /// <summary>
        /// Compiles template revealing all the `{@}`-placeholder to complete Javascript code suitable to be returned from JS function
        /// </summary>
        /// <param name="modelName">Variable name or custom JS expression that is supposed to be used as model</param>
        /// <param name="objectProperty">Model's property key that should be used to obtain exact model value. These 2 fields are made to support ^-syntax</param>
        /// <param name="defaultProperty">Property to reveal "@" access</param>
        /// <returns></returns>
        public string Compile(string modelName, string objectProperty, string defaultProperty)
        {
            return Compile(Build(), modelName, objectProperty, defaultProperty);
        }

        

        /// <summary>
        /// Compiles JS expression with {@}-placeholders to JS expression suitable for return statement
        /// </summary>
        /// <param name="expression">{@}-placeholder-expression. Grave accents are not needed here</param>
        /// <param name="modelName">Variable name or custom JS expression that is supposed to be used as model</param>
        /// <param name="objectProperty">Model's property key that should be used to obtain exact model value. These 2 fields are made to support ^-syntax</param>
        /// <param name="defaulProperty">Object property to reveal "@" access</param>
        /// <returns></returns>
        public static string CompileExpression(string expression, string modelName, string objectProperty, string defaulProperty)
        {
            StringBuilder sb = new StringBuilder();
            CrunchExpression(expression, modelName, objectProperty, defaulProperty, sb, 0);
            return sb.ToString();
        }

        private static int CrunchExpression(string tpl, string modelName, string objectProperty, string defaulProperty, StringBuilder sb,
            int beginIndex)
        {
            for (int i = beginIndex; i < tpl.Length; i++)
            {
                if (tpl[i] == '`') return i;

                if (tpl[i] == '{' && (i < tpl.Length - 2 && IsValidToken(tpl[i + 1])))
                {
                    i = CrunchFieldReference(tpl, modelName, objectProperty, defaulProperty, sb, i + 1);
                    continue;
                }
                sb.Append(tpl[i]);
            }
            return tpl.Length;
        }

        private static int CrunchFieldReference(string tpl, string modelName, string objectProperty, string defaultProperty, StringBuilder sb, int i)
        {
            sb.Append(modelName);
            if (IsValidSelfReference(tpl[i]) && tpl[i + 1] == '}')
            {
                if (!string.IsNullOrEmpty(defaultProperty)) sb.AppendFormat(".{0}", defaultProperty);
                return i + 1;
            }
            if (tpl[i] == '^')
            {
                sb.Append('.');
                i++;
            }
            else
            {
                if (!string.IsNullOrEmpty(objectProperty)) sb.AppendFormat(".{0}.", objectProperty);
                else sb.Append('.');
            }

            for (; i < tpl.Length; i++)
            {
                if (tpl[i] == '}')
                    return i;
                sb.Append(tpl[i]);
            }
            return i;
        }

        private static bool IsValidSelfReference(char token)
        {
            return token == '@' || token == '$' || token == '#' || token == '%' || token == '*';
        }
        private static bool IsValidToken(char token)
        {
            return char.IsLetter(token) || token == '^' || IsValidSelfReference(token);
        }

        /// <summary>
        /// Compiles template revealing all the `{@}`-placeholder to complete Javascript code suitable to be returned from JS function
        /// </summary>
        /// <param name="tpl">Built template code containing `{@}`-placeholders</param>
        /// <param name="modelName">Variable name or custom JS expression that is supposed to be used as model</param>
        /// <param name="objectProperty">Model's property key that should be used to obtain exact model value. These 2 fields are made to support ^-syntax</param>
        /// <param name="defaultProperty">Object property to reveal "@" access</param>
        /// <returns></returns>
        public static string Compile(string tpl, string modelName, string objectProperty, string defaultProperty)
        {
            if (string.IsNullOrEmpty(tpl)) return "''";
            StringBuilder sb = new StringBuilder();

            if (tpl[0] != '`' && tpl[0] != '{') sb.Append("'");

            for (int i = 0; i < tpl.Length; i++)
            {
                if (tpl[i] == '\n')
                {
                    sb.Append("\\n");
                    continue;
                }
                if (tpl[i] == '\r')
                {
                    sb.Append("\\r");
                    continue;
                }
                if (tpl[i] == '`')
                {
                    if (i > 0) sb.Append("' +");
                    i = CrunchExpression(tpl, modelName, objectProperty, defaultProperty, sb, i + 1);
                    if (i < tpl.Length - 1) sb.Append("+ '");
                    continue;
                }
                if (tpl[i] == '{' && (i < tpl.Length - 1) && tpl[i + 1] == '{')
                {
                    sb.Append('{');
                    continue;
                }
                if (tpl[i] == '{' && IsValidToken(tpl[i + 1]))
                {
                    if (i > 0) sb.Append("' +");
                    i = CrunchFieldReference(tpl, modelName, objectProperty, defaultProperty, sb, i + 1);
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

        /// <summary>
        /// Shortcut method to compile templates directly from delegates
        /// </summary>
        /// <param name="templateDelegate">Template delegate</param>
        /// <param name="modelName">Variable name or custom JS expression that is supposed to be used as model</param>
        /// <param name="objectProperty">Model's property key that should be used to obtain exact model value. These 2 fields are made to support ^-syntax</param>
        /// <param name="defaultProperty">Object property to reveal "@" access</param>
        /// <returns></returns>
        public static string CompileDelegate(Action<Template> templateDelegate, string modelName, string objectProperty, string defaultProperty)
        {
            Template t = new Template();
            templateDelegate(t);
            return t.Compile(modelName, objectProperty, defaultProperty);
        }


        /// <summary>
        /// Shortcut method to build templates directly from delegates
        /// </summary>
        /// <param name="templateDelegate">Template delegate</param>
        /// <returns></returns>
        public static string BuildDelegate(Action<Template> templateDelegate)
        {
            Template t = new Template();
            templateDelegate(t);
            return t.Build();
        }
    }
}
