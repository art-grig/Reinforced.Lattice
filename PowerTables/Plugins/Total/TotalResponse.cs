using System.Collections.Generic;


namespace PowerTables.Plugins.Total
{
    /// <summary>
    /// Additional data that will be used to calculate totals
    /// </summary>
    public class TotalResponse
    {
        /// <summary>
        /// Totals for particular columns
        /// </summary>
        public Dictionary<string, object> TotalsForColumns { get; set; }
    }
}
