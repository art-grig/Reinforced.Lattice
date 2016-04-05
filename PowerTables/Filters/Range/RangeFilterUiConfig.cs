using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

using PowerTables.Filters.Select;

namespace PowerTables.Filters.Range
{
    /// <summary>
    /// UI configuration for range filterr
    /// </summary>
    public class RangeFilterUiConfig
    {
        /// <summary>
        /// Place holder for "From" field
        /// </summary>
        public string FromPlaceholder { get; set; }

        /// <summary>
        /// Placeholder for "To" field
        /// </summary>
        public string ToPlaceholder { get; set; }

        /// <summary>
        /// Delay between field change and request processing begins
        /// </summary>
        public int InputDelay { get; set; }

        /// <summary>
        /// "From" box preselected value
        /// </summary>
        public string FromValue { get; set; }

        /// <summary>
        /// "To" box preselected value
        /// </summary>
        public string ToValue { get; set; }

        public RangeFilterUiConfig()
        {
            FromPlaceholder = "From";
            ToPlaceholder = "To";
            InputDelay = 500;
        }
    }
}
