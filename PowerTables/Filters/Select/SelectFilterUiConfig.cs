using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;


namespace PowerTables.Filters.Select
{
    /// <summary>
    /// UI configuration for select filter 
    /// </summary>
    public class SelectFilterUiConfig
    {
        /// <summary>
        /// Preselected filter value
        /// </summary>
        public string SelectedValue { get; set; }

        /// <summary>
        /// When true, option to select "Any" entry will be added to filter
        /// </summary>
        public bool AllowSelectNothing { get; set; }

        /// <summary>
        /// When true, ability to select multiple possible values will be available
        /// </summary>
        public bool IsMultiple { get; set; }

        /// <summary>
        /// Text for "Any" select option
        /// </summary>
        public string NothingText { get; set; }

        /// <summary>
        /// Column name this filter associated with
        /// </summary>
        public string ColumnName { get; set; }

        /// <summary>
        /// Select filter value list
        /// </summary>
        public List<SelectListItem> Items { get; set; }

        /// <summary>
        /// Turn this filter to be working on client-side
        /// </summary>
        public bool ClientFiltering { get; set; }

        /// <summary>
        /// Specifies custom client filtering function. 
        /// Function type: (datarow:any, filterSelection:string[], query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// filterSelection: selected values
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        public JRaw ClientFilteringFunction { get; set; }
        
    }

    public static class ValueFilterUiExtensions
    {
        /// <summary>
        /// Enables client filtering and specifies custom client filtering function. 
        /// 
        /// Function type: (datarow:any, filterSelection:string[], query:IQuery) => boolean
        /// dataRow: JSON-ed TTableObject
        /// filterSelection: selected values
        /// query: IQuery object
        /// Returns: true for satisfying objects, false otherwise
        /// </summary>
        public static SelectFilterUiConfig ClientFiltering(this SelectFilterUiConfig c, string function = null)
        {
            c.ClientFiltering = true;
            c.ClientFilteringFunction = new JRaw(string.IsNullOrEmpty(function) ? "null" : function);
            return c;
        }
    }

    
}
