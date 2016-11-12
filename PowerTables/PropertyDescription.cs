using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables
{
    /// <summary>
    /// Intermediate proxy for describing property, reflecting column
    /// </summary>
    public struct PropertyDescription
    {
        /// <summary>
        /// Raw column name - for non-additional columns is equal to row class' corresponding property name
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Property (column) data type
        /// </summary>
        public Type PropertyType { get; private set; }

        /// <summary>
        /// Function for retrieving column's value from row object
        /// </summary>
        public Func<object, object> GetValue { get; private set; }

        /// <summary>
        /// Function for setting column's value for existing row object
        /// </summary>
        public Action<object, object> SetValue { get; private set; }

        /// <summary>
        /// Column title
        /// </summary>
        public string Title { get; private set; }

        /// <summary>
        /// Reference to column's original property - null for added columns that are not present in rod data object
        /// </summary>
        public PropertyInfo Property { get; private set; }

        internal PropertyDescription(string propertyName, Type propertyType, string title, Func<object, object> getValue, Action<object, object> setFunc, PropertyInfo property)
            : this()
        {
            Name = propertyName;
            PropertyType = propertyType;
            GetValue = getValue;
            Title = title;
            SetValue = setFunc;
            Property = property;
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
            return new PropertyDescription(pi.Name, pi.PropertyType, title, pi.GetValue, pi.SetValue, pi);
        }
    }
}
