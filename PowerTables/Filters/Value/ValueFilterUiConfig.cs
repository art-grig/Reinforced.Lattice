using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PowerTables.Filters.Value
{
    /// <summary>
    /// UI configuration for value filter
    /// </summary>
    public class ValueFilterUiConfig
    {
        /// <summary>
        /// Placeholder text
        /// </summary>
        public string Placeholder { get; set; }

        /// <summary>
        /// Delay between field change and request processing begins
        /// </summary>
        public int InputDelay { get; set; }

        /// <summary>
        /// Preselected value
        /// </summary>
        public string DefaultValue { get; set; }

        public ValueFilterUiConfig()
        {
            InputDelay = 500;
        }
    }
}
