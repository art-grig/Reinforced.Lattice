using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Total
{
    /// <summary>
    /// Client configuration for totals
    /// </summary>
    public class TotalClientConfiguration
    {
        /// <summary>
        /// Show totals on the top of the displayed lines or not
        /// </summary>
        public bool ShowOnTop { get; set; }

        /// <summary>
        /// Functions for formatting of received values
        /// </summary>
        public Dictionary<string, JRaw> ColumnsValueFunctions { get; set; }

        /// <summary>
        /// Functions for calculating totals
        /// </summary>
        public Dictionary<string, JRaw> ColumnsCalculatorFunctions { get; set; }
    }
}
