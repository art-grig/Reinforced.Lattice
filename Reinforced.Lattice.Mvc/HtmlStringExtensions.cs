using System;
using System.Text;
using System.Web;
using PowerTables.CellTemplating;

namespace Reinforced.Lattice.Mvc
{
    public static class HtmlStringExtensions
    {
        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="content">Text to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, IHtmlString content)
        {
            return x.ReturnsIf(expression, SanitizeHtmlString(content));
        }

        /// <summary>
        /// Template will return specified content if specified column is null or undefined
        /// </summary>
        /// <param name="expression">Expression to check</param>
        /// <param name="content">Content to return</param>
        /// <returns></returns>
        public static CellTemplateBuilder IfNotPresent(this CellTemplateBuilder x, string expression, IHtmlString content)
        {
            return x.IfNotPresent(expression, SanitizeHtmlString(content));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, IHtmlString positiveContent, IHtmlString negativeContent)
        {
            return x.ReturnsIf(expression, SanitizeHtmlString(positiveContent),
                SanitizeHtmlString(negativeContent));
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, IHtmlString positiveContent, string negativeContent)
        {
            return x.ReturnsIf(expression, SanitizeHtmlString(positiveContent), negativeContent);
        }

        /// <summary>
        /// Returns specified template part if condition met
        /// </summary>
        /// <param name="expression">Expression</param>
        /// <param name="positiveContent">Content if expression is positive</param>
        /// <param name="negativeContent">Content if expression is negative</param>
        /// <returns></returns>
        public static CellTemplateBuilder ReturnsIf(this CellTemplateBuilder x, string expression, string positiveContent, IHtmlString negativeContent)
        {
            return x.ReturnsIf(expression, positiveContent, SanitizeHtmlString(negativeContent));
        }


        internal static string SanitizeHtmlString(IHtmlString str)
        {
            return SanitizeHtmlString(str.ToHtmlString());
        }

        internal static string SanitizeHtmlString(string s)
        {
            StringBuilder sb = new StringBuilder(s.Length);

            char[] hex = new char[2];
            for (int i = 0; i < s.Length; i++)
            {
                if (s[i] == '\r')
                {
                    sb.Append("\\r");
                    continue;
                }

                if (s[i] == '\n')
                {
                    sb.Append("\\n");
                    continue;
                }

                if (s[i] == '%')
                {
                    if (i < s.Length - 2)
                    {
                        hex[0] = s[i + 1];
                        hex[1] = s[i + 2];
                        string hx = new string(hex, 0, 2);
                        switch (hx.ToLower())
                        {
                            case "40": sb.Append("@"); i += 2; break;
                            case "24": sb.Append("$"); i += 2; break;
                            case "25": sb.Append("%"); i += 2; break;
                            case "23": sb.Append("#"); i += 2; break;
                            case "60": sb.Append("`"); i += 2; break;
                            case "7b": sb.Append("{"); i += 2; break;
                            case "7d": sb.Append("}"); i += 2; break;
                            default: sb.Append(s[i]); break;
                        }
                        continue;
                    }
                }
                sb.Append(s[i]);
            }
            return sb.ToString();
        }

        /// <summary>
        /// Changes specified style of element
        /// </summary>
        /// <param name="styleKey">CSS style namt</param>
        /// <param name="styleValue">CSS style value</param>
        /// <returns></returns>
        public static Template Css(this Template x, IHtmlString styleKey, IHtmlString styleValue)
        {
            return x.Css(SanitizeHtmlString(styleKey), SanitizeHtmlString(styleValue));
        }

        /// <summary>
        /// Changes specified style of element
        /// </summary>
        /// <param name="styleKey">CSS style namt</param>
        /// <param name="styleValue">CSS style value</param>
        /// <returns></returns>
        public static Template Css(this Template x, string styleKey, IHtmlString styleValue)
        {
            return x.Css(styleKey, SanitizeHtmlString(styleValue));
        }

        /// <summary>
        /// Changes specified style of element
        /// </summary>
        /// <param name="styleKey">CSS style namt</param>
        /// <param name="styleValue">CSS style value</param>
        /// <returns></returns>
        public static Template Css(this Template x, IHtmlString styleKey, string styleValue)
        {
            return x.Css(SanitizeHtmlString(styleKey), styleValue);
        }

        /// <summary>
        /// Specifies in-element content
        /// </summary>
        /// <param name="content">Raw HTML content</param>
        /// <returns></returns>
        public static Template After(this Template x, IHtmlString content)
        {
            return x.After(SanitizeHtmlString(content));
        }

        /// <summary>
        /// Specifies in-element content
        /// Supports {- and `-syntax
        /// </summary>
        /// <param name="content">Raw HTML content</param>
        /// <returns></returns>
        public static Template Content(this Template x, IHtmlString content)
        {
            return x.Content(SanitizeHtmlString(content));
        }


        /// <summary>
        /// Changes/updates specified data-attribute of resulting tag
        /// </summary>
        /// <param name="dataName">data name</param>
        /// <param name="dataValue">data value</param>
        /// <returns></returns>
        public static Template Data(this Template x, IHtmlString dataName, IHtmlString dataValue)
        {
            return x.Data(SanitizeHtmlString(dataName), SanitizeHtmlString(dataValue));
        }

        /// <summary>
        /// Changes/updates specified data-attribute of resulting tag
        /// </summary>
        /// <param name="dataName">data name</param>
        /// <param name="dataValue">data value</param>
        /// <returns></returns>
        public static Template Data(this Template x, string dataName, IHtmlString dataValue)
        {
            return x.Data(dataName, SanitizeHtmlString(dataValue));
        }

        /// <summary>
        /// Changes/updates specified data-attribute of resulting tag
        /// </summary>
        /// <param name="dataName">data name</param>
        /// <param name="dataValue">data value</param>
        /// <returns></returns>
        public static Template Data(this Template x, IHtmlString dataName, string dataValue)
        {
            return x.Data(SanitizeHtmlString(dataName), dataValue);
        }

        /// <summary>
        /// Adds attribute to in-cell element
        /// </summary>
        /// <param name="attrName">Attribute name</param>
        /// <param name="attrValue">Attribute value</param>
        /// <returns></returns>
        public static Template Attr(this Template x, IHtmlString attrName, IHtmlString attrValue)
        {
            return x.Attr(SanitizeHtmlString(attrName), SanitizeHtmlString(attrValue));
        }

        /// <summary>
        /// Adds attribute to in-cell element
        /// </summary>
        /// <param name="attrName">Attribute name</param>
        /// <param name="attrValue">Attribute value</param>
        /// <returns></returns>
        public static Template Attr(this Template x, string attrName, IHtmlString attrValue)
        {
            return x.Attr(attrName, SanitizeHtmlString(attrValue));
        }

        /// <summary>
        /// Adds attribute to in-cell element
        /// </summary>
        /// <param name="attrName">Attribute name</param>
        /// <param name="attrValue">Attribute value</param>
        /// <returns></returns>
        public static Template Attr(this Template x, IHtmlString attrName, string attrValue)
        {
            return x.Attr(SanitizeHtmlString(attrName), attrValue);
        }

        /// <summary>
        /// Specifies button tag
        /// </summary>
        /// <param name="classes">Css classes string</param>
        /// <returns></returns>
        public static Template RemoveClass(this Template x, IHtmlString classes)
        {
            return x.RemoveClass(SanitizeHtmlString(classes));
        }

        /// <summary>
        /// Specifies button tag
        /// </summary>
        /// <param name="classes">Css classes string</param>
        /// <returns></returns>
        public static Template Class(this Template x, IHtmlString classes)
        {
            return x.Class(SanitizeHtmlString(classes));
        }

        /// <summary>
        /// Specifies button tag
        /// </summary>
        /// <param name="tag"></param>
        /// <returns></returns>
        public static Template Tag(this Template x, IHtmlString tag)
        {
            return x.Tag(SanitizeHtmlString(tag));
        }

        /// <summary>
        /// Specifies template for default condition
        /// </summary>
        /// <param name="content">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public static SwitchBuilder Default(this SwitchBuilder x, IHtmlString content)
        {
            return x.Default(SanitizeHtmlString(content));
        }

        /// <summary>
        /// Specifies template for single condition
        /// </summary>
        /// <param name="caseExpression">Case `{@}`-expression</param>
        /// <param name="template">TemplTE builder</param>
        /// <returns>Fluent</returns>
        public static SwitchBuilder When(this SwitchBuilder x, string caseExpression, IHtmlString content)
        {
            return x.When(caseExpression, String.Format("'{0}'", HtmlStringExtensions.SanitizeHtmlString(content)));
        }

    }
}
