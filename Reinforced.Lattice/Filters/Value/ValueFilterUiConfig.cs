using Newtonsoft.Json.Linq;
using Reinforced.Lattice.Plugins;


namespace Reinforced.Lattice.Filters.Value
{
    /// <summary>
    /// UI configuration for value filter
    /// </summary>
    public class ValueFilterUiConfig : IHideableFilter, IProvidesColumnName, IProvidesTemplate, IClientFiltering, IInputDelay
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

        /// <summary>
        /// Column name this filter associated with
        /// </summary>
        public string ColumnName { get; set; }

        /// <summary>
        /// Turn this filter to be working on client-side
        /// </summary>
        public bool ClientFiltering { get; set; }

        /// <summary>
        /// Specifies custom client filtering function. 
        /// Function type: (datarow:any, filterValue:string, query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// filterValue: value entered to filter
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        public JRaw ClientFilteringFunction { get; set; }

        /// <summary>
        /// When true, filter UI is not being rendered but client query modifier persists
        /// </summary>
        public bool Hidden { get; set; }

        /// <summary>
        /// When true, client value filter will ignore time in case of dates filtering
        /// </summary>
        public bool CompareOnlyDates { get; set; }

        public ValueFilterUiConfig()
        {
            InputDelay = 500;
        }

        public string DefaultTemplateId { get { return "valueFilter"; } }
    }
}
