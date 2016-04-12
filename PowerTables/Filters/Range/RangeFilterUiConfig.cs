using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using PowerTables.Filters.Select;

namespace PowerTables.Filters.Range
{
    /// <summary>
    /// UI configuration for range filterr
    /// </summary>
    public class RangeFilterUiConfig : IHideableFilter
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


        public RangeFilterUiConfig()
        {
            FromPlaceholder = "From";
            ToPlaceholder = "To";
            InputDelay = 500;
        }

        public bool Hidden { get; set; }
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
        public static RangeFilterUiConfig ClientFiltering(this RangeFilterUiConfig c, string function = null)
        {
            c.ClientFiltering = true;
            c.ClientFilteringFunction = new JRaw(string.IsNullOrEmpty(function) ? "null" : function);
            return c;
        }
    }
}
