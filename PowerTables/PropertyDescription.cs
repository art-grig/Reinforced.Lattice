using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables
{
    public struct PropertyDescription
    {
        public string Name { get; private set; }

        public Type PropertyType { get; private set; }

        public Func<object, object> GetValue { get; private set; }
        public Action<object,object> SetValue { get; private set; }
        
        public string Title { get; private set; }

        public PropertyDescription(string propertyName, Type propertyType, string title, Func<object, object> getValue, Action<object, object> setFunc) : this()
        {
            Name = propertyName;
            PropertyType = propertyType;
            GetValue = getValue;
            Title = title;
            SetValue = setFunc;
        }

        public override string ToString()
        {
            return string.Format("{0} ({1}) <{2}>", Title, Name, PropertyType.FullName);
        }
    }

    internal static class PropertyDescriptionExtensions
    {
        public static PropertyDescription Description(this PropertyInfo pi)
        {
            var title = pi.Name;
            var attr = pi.GetCustomAttribute<DisplayAttribute>();
            if (attr != null)
            {
                if (!string.IsNullOrEmpty(attr.Name)) title = attr.Name;
            }
            return new PropertyDescription(pi.Name, pi.PropertyType, title,pi.GetValue, pi.SetValue);
        }
    }
}
