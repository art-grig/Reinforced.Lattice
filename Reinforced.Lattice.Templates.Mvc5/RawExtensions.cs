using System;
using System.Text;
using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates
{
    public static class RawExtensions
    {
        public static Inline _(this IRawProvider r, string code)
        {
            //r.Raw(code);
            return r.Raw(code);
        }

        public static Inline _(this IRawProvider r, Inline code)
        {
            //r.Raw(code);
            return r.Raw(code.ToString());
        }

        public static Inline _(this IRawProvider r, string code, object arg1)
        {
            return r.Raw(string.Format(code, arg1));
        }

        public static Inline _(this IRawProvider r, string code, object arg1, object arg2)
        {
            return r.Raw(string.Format(code, arg1, arg2));
        }

        public static Inline _(this IRawProvider r, string code, object arg1, object arg2, object arg3)
        {
            return r.Raw(string.Format(code, arg1, arg2, arg3));
        }

        public static Inline RawHtml(this IRawProvider r, string html)
        {
            return r.Raw(Prettify(html));
        }

        public static string Prettify(string str)
        {
            if (string.IsNullOrEmpty(str)) return String.Empty;
            StringBuilder sb = new StringBuilder("s(");
            bool modeString = false;

            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] == ' ' && IsLongSpaces(str, i))
                {
                    var spacesCnt = CrunchSpaces(str, i);
                    if (modeString)
                    {
                        sb.Append("\',");
                        modeString = false;
                    }
                    sb.Append(spacesCnt);
                    i += spacesCnt;
                }
                else
                {
                    if (i == 0) sb.Append('\'');
                    else if (!modeString) sb.Append(",\'");
                    if (str[i] == '/')
                    {
                        if (IsScript(str, i)) sb.Append("\\/");
                        else sb.Append('/');
                    }
                    else sb.SafeAppend(str[i]);
                    modeString = true;
                }
            }
            if (modeString) sb.Append('\'');
            sb.Append(");");
            return sb.ToString();
        }

        private static void SafeAppend(this StringBuilder sb, char c)
        {
            switch (c)
            {
                case '\'': sb.Append("\\'"); break;
                case '\\': sb.Append("\\\\"); break;
                case '\r': sb.Append("\\r"); break;
                case '\n': sb.Append("\\n"); break;
                case '\t': sb.Append("\\t"); break;
                default: sb.Append(c); break;
            }
        }

        private static bool IsScript(string str, int idx)
        {
            return (str.IndexOf("/script", idx, StringComparison.OrdinalIgnoreCase) != -1);
        }

        private static bool IsLongSpaces(string str, int idx)
        {
            if (idx <= str.Length - 2)
            {
                return str[idx + 1] == ' ';
            }
            return false;
        }
        private static int CrunchSpaces(string str, int idx)
        {
            int result = 1;
            idx++;
            while (idx < str.Length && str[idx] == ' ')
            {
                result++;
                idx++;
            }
            return result - 1;
        }
    }
}
