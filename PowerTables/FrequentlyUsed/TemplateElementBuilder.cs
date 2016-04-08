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
    public class TemplateElementBuilder
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
        public TemplateElementBuilder Tag(string tag)
        {
            _tag = tag;
            return this;
        }

        /// <summary>
        /// Specifies button tag
        /// </summary>
        /// <param name="classes">Css classes string</param>
        /// <returns></returns>
        public TemplateElementBuilder Class(string classes)
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
        public TemplateElementBuilder Attr(string attrName, string attrValue)
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
        public TemplateElementBuilder Inside(string content)
        {
            _content = content; ;
            return this;
        }

        /// <summary>
        /// Specifies in-element content
        /// </summary>
        /// <param name="builder">builder action for inner element content</param>
        /// <returns></returns>
        public TemplateElementBuilder Inside(Action<TemplateElementBuilder> builder)
        {
            TemplateElementBuilder b = new TemplateElementBuilder();
            builder(b);
            _content = b.Build();
            return this;
        }

        /// <summary>
        /// Specifies in-element content
        /// </summary>
        /// <param name="content">Raw HTML content</param>
        /// <returns></returns>
        public TemplateElementBuilder After(string content)
        {
            _ahead.Add(content);
            return this;
        }


        /// <summary>
        /// Specifies in-element content
        /// </summary>
        /// <param name="builder">builder action for inner element content</param>
        /// <returns></returns>
        public TemplateElementBuilder After(Action<TemplateElementBuilder> builder)
        {
            TemplateElementBuilder b = new TemplateElementBuilder();
            builder(b);
            _ahead.Add(b.Build());
            return this;
        }

        internal string Build()
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendFormat("<{0}",_tag);
            if (!string.IsNullOrEmpty(_classes))
            {
                sb.AppendFormat(" class=\"{0}\"", _classes);
            }
            for (int index= 0; index < _attributeNames.Count; index++)
            {
                var attrName = _attributeNames[index];
                var attrValue = _attributeValues[index];
                sb.AppendFormat(" {0}=\"{1}\"", attrName, attrValue);
            }
            sb.AppendFormat(">{0}</{1}>", _content, _tag);
            foreach (var a in _ahead)
            {
                sb.Append(a);
            }
            return sb.ToString();
        }
    }
}
