using Newtonsoft.Json.Linq;
using PowerTables.Plugins;

namespace PowerTables.Filters.Range
{
    /// <summary>
    /// UI configuration for range filterr
    /// </summary>
    public class RangeFilterUiConfig : IHideableFilter, IProvidesTemplate, IProvidesColumnName, IClientFiltering, IInputDelay
    {
        /// <summary>
        /// Column name this filter associated with
        /// </summary>
        public string ColumnName { get; set; }

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

        /// <summary>
        /// Turn this filter to be working on client-side
        /// </summary>
        public bool ClientFiltering { get; set; }

        /// <summary>
        /// Specifies custom client filtering function. 
        /// Function type: (datarow:any, fromValue:string, toValue:string, query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// fromValue: min. value entered to filter
        /// toValue: max. value entered to filter
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        public JRaw ClientFilteringFunction { get; set; }


        /// <summary>
        /// Gets or sets ability of range filter to convert dates ranges to 1 day automatically when single day is selected
        /// </summary>
        public bool TreatEqualDateAsWholeDay { get; set; }

        public RangeFilterUiConfig()
        {
            FromPlaceholder = "From";
            ToPlaceholder = "To";
            InputDelay = 500;
        }

        public bool Hidden { get; set; }
        public string DefaultTemplateId { get { return "rangeFilter"; } }
    }
}
