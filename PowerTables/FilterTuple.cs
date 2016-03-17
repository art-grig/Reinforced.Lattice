using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables
{
    public static class FilterTuple
    {
        /// <summary>
        /// Converts supplied value to filter-friendly tuple
        /// </summary>
        /// <typeparam name="T">Value type</typeparam>
        /// <param name="value">Value</param>
        /// <returns>Filter tuple</returns>
        public static Tuple<bool, T> ToFilterTuple<T>(this T value)
        {
            return new Tuple<bool, T>(true, value);
        }

        /// <summary>
        /// Converts supplied value to filter-friendly tuple 
        /// if it is not equal to supplied value.
        /// </summary>
        /// <typeparam name="T">Value type</typeparam>
        /// <param name="value">Value</param>
        /// <param name="notValue">Value that will resulf false-tuple</param>
        /// <returns>Filter tuple</returns>
        public static Tuple<bool, T> TupleIfNot<T>(this T value, T notValue) where T:struct 
        {
            if (value.Equals(notValue)) return new Tuple<bool, T>(false, default(T));
            return new Tuple<bool, T>(true, value);
        }

        /// <summary>
        /// Converts supplied value to filter-friendly tuple 
        /// in case if value is not null
        /// </summary>
        /// <typeparam name="T">Value type</typeparam>
        /// <param name="value">Value</param>
        /// <returns>Filter tuple</returns>
        public static Tuple<bool, T> TupleIfNotNull<T>(this T value) where T : class
        {
            if (value == null) return new Tuple<bool, T>(false, null);
            return new Tuple<bool, T>(true, value);
        }

        /// <summary>
        /// Supplies empty filter tuple of supplied type
        /// </summary>
        /// <typeparam name="T">Value type</typeparam>
        /// <returns>Filter tuple</returns>
        public static Tuple<bool, T> None<T>()
        {
            return new Tuple<bool, T>(false, default(T));
        }
    }
}
