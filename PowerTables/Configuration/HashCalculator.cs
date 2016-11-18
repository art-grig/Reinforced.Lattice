using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Configuration
{
    internal class HashCalculator
    {
        private readonly IReadOnlyCollection<PropertyDescription> _properties;
        private readonly PropertyDescription[] _keyColumns;
        private readonly Type _rowType;
        private static readonly CultureInfo UsCulture = CultureInfo.CreateSpecificCulture("en-US");

        public HashCalculator(IReadOnlyCollection<PropertyDescription> properties, string[] fieldsSet, Type rowType)
        {
            _properties = properties;
            _rowType = rowType;
            List<PropertyDescription> pd = new List<PropertyDescription>();

            var props = _properties.Where(c => fieldsSet.Contains(c.Name)).ToDictionary(c => c.Name);
            for (int i = 0; i < fieldsSet.Length; i++)
            {
                if (!props.ContainsKey(fieldsSet[i]))
                {
                    throw new Exception(string.Format("Table row object does not contain column {0} mentioned as primary keypart", fieldsSet[i]));
                }
                pd.Add(props[fieldsSet[i]]);
            }
            _keyColumns = pd.ToArray();
        }

        private static bool IsInteger(Type t)
        {
            return (t == typeof(int))
                   || (t == typeof(uint))
                   || (t == typeof(long))
                   || (t == typeof(ulong))
                   || (t == typeof(byte))
                   || (t == typeof(char));
        }

        private static bool IsFloating(Type t)
        {
            return (t == typeof(float))
                   || (t == typeof(decimal))
                   || (t == typeof(double));
        }


        #region Obtaining key
        public string GetKey(object obj)
        {
            StringBuilder sb = new StringBuilder();
            foreach (var propertyInfo in _keyColumns)
            {
                var val = propertyInfo.GetValue(obj);
                sb.AppendFormat("{0}:", ConvertToPrimaryKeyString(val, propertyInfo.PropertyType));
            }
            return sb.ToString();
        }

        private static string ConvertToPrimaryKeyString(object value, Type type)
        {
            if ((type == typeof(string)) && value == null) return ValueConverter.NotPresentValue;

            if (value == null) return string.Empty;
            if (type.IsNullable()) type = type.GetArg();
            if (IsInteger(type)) return ConvertInteger(value);
            if (type.IsEnum) return ConvertInteger(value);
            if (IsFloating(type)) return ConvertFloating(value);
            if (type == typeof(bool)) return ConvertBoolean(value);
            if (type == typeof(string)) return ConvertString(value);
            if (type == typeof(DateTime)) return ConvertDate(value);
            if (type == typeof(Guid)) return ConvertGuid(value);
            throw new Exception(string.Format("Sorry, Reinforced.Lattice does not support type {0} as primary key", type.FullName));
        }

        private static string ConvertFloating(object value)
        {
            return Convert.ToDouble(value).ToString(UsCulture);
        }

        private static string ConvertInteger(object value)
        {
            return value.ToString();
        }

        private static string ConvertBoolean(object value)
        {
            return (bool)value ? "1" : "0";
        }

        private static string ConvertGuid(object value)
        {
            return value.ToString();
        }

        private static string ConvertString(object value)
        {
            StringBuilder sb = new StringBuilder();
            var str = (string)value;
            for (int i = 0; i < str.Length; i++)
            {
                if (str[i] == '\\') sb.Append("\\\\");
                else if (str[i] == ':') sb.Append("\\:");
                else sb.Append(str[i]);
            }
            return sb.ToString();
        }

        private static string ConvertDate(object value)
        {
            return ((long)((DateTime)value).Subtract(new DateTime(1970, 1, 1)).TotalMilliseconds).ToString();
        }


        #endregion

        #region Key decryption

        public object DecryptHash(string hash)
        {
            List<string> values = new List<string>();
            int cStart = 0;
            bool escape = false;
            for (int i = 0; i < hash.Length; i++)
            {
                if (hash[i] == '\\')
                {
                    escape = true;
                    continue;
                }
                if (!escape)
                {
                    if (hash[i] == ':')
                    {
                        var len = i - cStart - 1;
                        values.Add(len == 0 ? string.Empty : hash.Substring(cStart, i - cStart));
                        if (i + 1 == hash.Length) break;
                        cStart = i + 1;
                    }
                }
                escape = false;
            }
            if (values.Count != _keyColumns.Length) throw new Exception(string.Format("Malformed object hash: {0}", hash));
            object result = Activator.CreateInstance(_rowType);
            for (int i = 0; i < values.Count; i++)
            {
                var str = values[i];
                var prop = _keyColumns[i];
                prop.SetValue(result, DecryptValue(str, prop.PropertyType));
            }
            return result;
        }

        private object DecryptValue(string value, Type type)
        {
            if ((type == typeof(string)) && value == ValueConverter.NotPresentValue)
            {
                return null;
            }
            if ((type == typeof(string)) && string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            var nlbl = type.IsNullable();
            if (nlbl && string.IsNullOrEmpty(value)) return null;
            if (nlbl) type = type.GetArg();

            if (IsInteger(type)) return DecryptInteger(value, type);
            if (type.IsEnum) return DecryptEnum(value, type);
            if (IsFloating(type)) return DecryptFloating(value, type);
            if (type == typeof(bool)) return DecryptBoolean(value);
            if (type == typeof(string)) return DecryptString(value);
            if (type == typeof(DateTime)) return DecryptDate(value);
            if (type == typeof(Guid)) return DecryptGuid(value);
            throw new Exception(string.Format("Sorry, Reinforced.Lattice does not support type {0} as primary key", type.FullName));
        }

        private static object DecryptInteger(string value, Type type)
        {
            long number = string.IsNullOrEmpty(value) ? 0 : long.Parse(value);

            if (type == typeof(int)) return (int)number;
            if (type == typeof(uint)) return (uint)number;
            if (type == typeof(ulong)) return (ulong)number;
            if (type == typeof(byte)) return (byte)number;
            if (type == typeof(char)) return (char)number;
            return number;
        }

        private static object DecryptFloating(string value, Type type)
        {
            double number = string.IsNullOrEmpty(value) ? 0 : double.Parse(value);
            if (type == typeof(decimal)) return (decimal)number;
            if (type == typeof(float)) return (float)number;
            return number;
        }

        private static object DecryptEnum(string value, Type type)
        {
            var intVal = DecryptInteger(value, typeof(long));
            return Enum.ToObject(type, intVal);
        }

        private static object DecryptBoolean(string value)
        {
            return value == "1";
        }

        private static object DecryptDate(string value)
        {
            return (new DateTime(1970, 1, 1)).AddMilliseconds(long.Parse(value));
        }

        private static object DecryptGuid(string value)
        {
            return Guid.Parse(value);
        }

        private static object DecryptString(string value)
        {
            return value.Replace("\\\\", "\\").Replace("\\:", ":");
        }

        #endregion
    }
}
