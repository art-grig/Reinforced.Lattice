using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;


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

        public ValueFilterUiConfig()
        {
            InputDelay = 500;
        }
    }

    public static class ValueFilterUiExtensions
    {
        /// <summary>
        /// Enables client filtering and specifies custom client filtering function. 
        /// 
        /// Function type: (datarow:any, filterValue:string, query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// filterValue: value entered to filter
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        public static ValueFilterUiConfig ClientFiltering(this ValueFilterUiConfig c, string function = null)
        {
            c.ClientFiltering = true;
            c.ClientFilteringFunction = new JRaw(string.IsNullOrEmpty(function) ? "null" : function);
            return c;
        }
    }
}
