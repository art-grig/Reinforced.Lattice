using System.Collections.Generic;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;
using PowerTables.Plugins;


namespace PowerTables.Filters.Select
{
    /// <summary>
    /// UI configuration for select filter 
    /// </summary>
    public class SelectFilterUiConfig : IHideableFilter, IProvidesTemplate, IProvidesColumnName, IClientFiltering
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
        /// When true, option to select "Any" entry will be added to filter
        /// </summary>
        public bool AllowSelectNotPresent { get; set; }

        /// <summary>
        /// When true, ability to select multiple possible values will be available
        /// </summary>
        public bool IsMultiple { get; set; }

        /// <summary>
        /// Column name this filter associated with
        /// </summary>
        public string ColumnName { get; set; }

        /// <summary>
        /// Select filter value list
        /// </summary>
        public List<SelectListItem> Items { get; set; }
        
        public bool Hidden { get; set; }

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

        public string DefaultTemplateId { get { return "selectFilter"; } }

        public SelectFilterUiConfig()
        {
            Items = new List<SelectListItem>();
        }
    }

    
    
}
