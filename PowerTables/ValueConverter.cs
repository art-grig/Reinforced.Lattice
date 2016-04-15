using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

using PowerTables.Configuration;

namespace PowerTables
{
    public static class ValueConverter
    {
        /// <summary>
        /// Determines is type derived from Nullable or not
        /// </summary>
        /// <param name="t">Type</param>
        /// <returns>True if type is nullable value type. False otherwise</returns>
        public static bool IsNullable(this Type t)
        {
            return (t.IsGenericType && (t.GetGenericTypeDefinition() == typeof(Nullable<>)));
        }

        /// <summary>
        /// Retrieves first type argument of type
        /// </summary>
        /// <param name="t">Type</param>
        /// <returns>First type argument</returns>
        public static Type GetArg(this Type t)
        {
            return t.GetGenericArguments()[0];
        }

        public static TTarget Convert<TTarget>(string src)
        {
            return (TTarget)Convert(src, typeof(TTarget));
        }

        public static object Convert(string src, Type targetType)
        {
            if (string.IsNullOrEmpty(src)) return null;

            if (targetType == typeof(DateTime))
            {
                return DateTime.Parse(src, null, System.Globalization.DateTimeStyles.RoundtripKind);
            }

            if (targetType.IsNullable())
            {
                var tw = targetType.GetArg();
                object arg = Convert(src, tw);
                return Activator.CreateInstance(targetType, arg);
            }

            if (targetType.IsEnum)
            {
                return Enum.Parse(targetType, src);
            }

            var converter = TypeDescriptor.GetConverter(src.GetType());
            if (converter.CanConvertTo(targetType))
            {
                return converter.ConvertTo(src, targetType);
            }

            return System.Convert.ChangeType(src, targetType);
        }

        public static object MapValue(object src, Type targetType, IConfigurator conf)
        {
            if (src == null) return null;
            if (src is string)
            {
                if (string.IsNullOrEmpty(src.ToString()))
                {
                    return null;
                }
            }
            if (targetType == typeof(DateTime) && src is string)
            {
                return DateTime.Parse((string)src, null, System.Globalization.DateTimeStyles.RoundtripKind); ;
            }

            if (targetType.IsNullable())
            {
                var tw = targetType.GetArg();
                object arg = MapValue(src, tw, conf);
                return Activator.CreateInstance(targetType, arg);
            }

            var converter = TypeDescriptor.GetConverter(src.GetType());
            if (converter.CanConvertTo(targetType))
            {
                return converter.ConvertTo(src, targetType);
            }

            return System.Convert.ChangeType(src, targetType);
        }

        private static readonly Dictionary<Type, PropertyInfo> _nullableValueProperties = new Dictionary<Type, PropertyInfo>();

        public static object ExtractValueFromNullable(object nullable)
        {
            var objType = nullable.GetType();
            if (!objType.IsNullable()) return nullable;
            if (!_nullableValueProperties.ContainsKey(objType))
            {
                _nullableValueProperties[objType] = objType.GetProperty("Value");
            }
            return _nullableValueProperties[objType].GetValue(nullable);
        }

        /// <summary>
        /// Converts any instance to string friendly for filter defaul value
        /// </summary>
        /// <param name="value">Filter value</param>
        /// <returns>Filter-friendly string represending default value</returns>
        public static string ToFilterDefaultString(object value)
        {
            if (value == null) return null;
            var s = value.ToString();
            var type = value.GetType();
            if (type == typeof(DateTime))
            {
                s = ((DateTime)(object)value).ToString("o");
            }
            if (type == typeof(DateTime?))
            {
                var t = value as DateTime?;
                if (t != null) s = t.Value.ToString("o");
            }
            return s;
        }

    }
}
