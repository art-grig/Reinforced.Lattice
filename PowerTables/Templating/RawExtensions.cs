using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerTables.Templating
{
    public static class RawExtensions
    {
        public static MvcHtmlString _(this IRawProvider r, string code)
        {
            r.Raw(code);
            return MvcHtmlString.Empty;
        }

        public static MvcHtmlString _(this IRawProvider r, string code, object arg1)
        {
            r.Raw(string.Format(code, arg1));
            return MvcHtmlString.Empty;
        }

        public static MvcHtmlString _(this IRawProvider r, string code, object arg1, object arg2)
        {
            r.Raw(string.Format(code, arg1, arg2));
            return MvcHtmlString.Empty;
        }

        public static MvcHtmlString _(this IRawProvider r, string code, object arg1, object arg2, object arg3)
        {
            r.Raw(string.Format(code, arg1, arg2, arg3));
            return MvcHtmlString.Empty;
        }

        public static string Prettify(string str)
        {
            if (string.IsNullOrEmpty(str)) return String.Empty;
            StringBuilder sb = new StringBuilder("w('");
            for (int i = 0; i < str.Length; i++)
            {
                switch (str[i])
                {
                    case '\'': sb.Append("\\'"); break;
                    case '\\': sb.Append("\\\\"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\n': sb.Append("\\n"); break;
                    case '/': sb.Append("\\/"); break;
                    default:
                        sb.Append(str[i]);
                        break;
                }
            }
            sb.AppendLine("');");
            return sb.ToString();
        }
    }
}
