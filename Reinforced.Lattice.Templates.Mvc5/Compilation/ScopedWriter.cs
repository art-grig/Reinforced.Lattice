using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Reinforced.Lattice.Templates.Compilation
{
    public sealed class Inline : IHtmlString
    {
        private readonly string _internalString;

        public Inline(string internalString)
        {
            _internalString = internalString;
        }

        public override string ToString()
        {
            return _internalString;
        }

        public string ToHtmlString()
        {
            return _internalString;
        }

        public static Inline operator +(Inline x, Inline y)
        {
            return new Inline(x._internalString + y._internalString);
        }

        public static Inline operator +(Inline x, string y)
        {
            return new Inline(x._internalString + y);
        }

        public static Inline operator +(string x, Inline y)
        {
            return new Inline(x + y._internalString);
        }
    }
    internal sealed class ScopedWriter : TextWriter
    {
        private readonly TextWriter _original;

        private readonly ITemplatesScope _scope;
        public ScopedWriter(TextWriter original, ITemplatesScope scope)
        {
            _original = original;
            _scope = scope;
        }
        private readonly List<string> _Inlines = new List<string>();

        public Inline CreateRaw(string value)
        {
            _Inlines.Add(value);
            return new Inline(value);
        }

        public void WriteRaw(string value)
        {
            _original.Write(value);
        }

        public override void Write(string value)
        {
            if (_scope.Flow.CrunchingTemplate)
            {
                if (!_Inlines.Contains(value))
                {
                    value = RawExtensions.Prettify(value);
                }
                else
                {
                    _Inlines.Remove(value);
                }
            }
            _original.Write(value);
        }

        public override void Write(object value)
        {
            if (value != null && value is Inline)
            {
                throw new Exception("Works");
            }

            if (value != null && value is string)
            {
                if (_scope.Flow.CrunchingTemplate)
                {
                    value = RawExtensions.Prettify((string)value);
                }
            }
            _original.Write(value);
        }


        #region Delegation

        public override void Close()
        {
            _original.Close();
        }

        public override void Flush()
        {
            _original.Flush();
        }

        public override void Write(char value)
        {
            _original.Write(value);
        }

        public override void Write(char[] buffer)
        {
            _original.Write(buffer);
        }

        public override void Write(char[] buffer, int index, int count)
        {
            _original.Write(buffer, index, count);
        }

        public override void Write(bool value)
        {
            _original.Write(value);
        }

        public override void Write(int value)
        {
            _original.Write(value);
        }

        public override void Write(uint value)
        {
            _original.Write(value);
        }

        public override void Write(long value)
        {
            _original.Write(value);
        }

        public override void Write(ulong value)
        {
            _original.Write(value);
        }

        public override void Write(float value)
        {
            _original.Write(value);
        }

        public override void Write(double value)
        {
            _original.Write(value);
        }

        public override void Write(decimal value)
        {
            _original.Write(value);
        }

       
        public override void Write(string format, object arg0)
        {
            _original.Write(format, arg0);
        }

        public override void Write(string format, object arg0, object arg1)
        {
            _original.Write(format, arg0, arg1);
        }

        public override void Write(string format, object arg0, object arg1, object arg2)
        {
            _original.Write(format, arg0, arg1, arg2);
        }

        public override void Write(string format, params object[] arg)
        {
            _original.Write(format, arg);
        }

        public override void WriteLine()
        {
            _original.WriteLine();
        }

        public override void WriteLine(char value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(char[] buffer)
        {
            _original.WriteLine(buffer);
        }

        public override void WriteLine(char[] buffer, int index, int count)
        {
            _original.WriteLine(buffer, index, count);
        }

        public override void WriteLine(bool value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(int value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(uint value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(long value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(ulong value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(float value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(double value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(decimal value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(string value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(object value)
        {
            _original.WriteLine(value);
        }

        public override void WriteLine(string format, object arg0)
        {
            _original.WriteLine(format, arg0);
        }

        public override void WriteLine(string format, object arg0, object arg1)
        {
            _original.WriteLine(format, arg0, arg1);
        }

        public override void WriteLine(string format, object arg0, object arg1, object arg2)
        {
            _original.WriteLine(format, arg0, arg1, arg2);
        }

        public override void WriteLine(string format, params object[] arg)
        {
            _original.WriteLine(format, arg);
        }
#if ASYNC
        public override Task WriteAsync(char value)
        {
            return _original.WriteAsync(value);
        }

        public override Task WriteAsync(string value)
        {
            return _original.WriteAsync(value);
        }

        public override Task WriteAsync(char[] buffer, int index, int count)
        {
            return _original.WriteAsync(buffer, index, count);
        }

        public override Task WriteLineAsync(char value)
        {
            return _original.WriteLineAsync(value);
        }

        public override Task WriteLineAsync(string value)
        {
            return _original.WriteLineAsync(value);
        }

        public override Task WriteLineAsync(char[] buffer, int index, int count)
        {
            return _original.WriteLineAsync(buffer, index, count);
        }

        public override Task WriteLineAsync()
        {
            return _original.WriteLineAsync();
        }

        public override Task FlushAsync()
        {
            return _original.FlushAsync();
        }
#endif
        public override IFormatProvider FormatProvider
        {
            get { return _original.FormatProvider; }
        }

        public override string NewLine
        {
            get { return _original.NewLine; }
            set { _original.NewLine = value; }
        }

        public override Encoding Encoding
        {
            get { return _original.Encoding; }
        }



#endregion
    }
}
