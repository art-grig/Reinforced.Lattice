using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Filters.Range
{
    /// <summary>
    /// Set of extensions for Range filter UI configuration
    /// </summary>
    public static class RangeFilterUiConfigExtensions
    {
        /// <summary>
        /// Specifies raw default values for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="from">Raw value string for "from" box</param>
        /// <param name="to">Raw value for "to" box</param>
        /// <returns>Fluent</returns>
        public static RangeFilterUiConfig RawDefault(this RangeFilterUiConfig config, string from = null,
            string to = null)
        {
            config.FromValue = from;
            config.ToValue = to;
            return config;
        }

    }
}
