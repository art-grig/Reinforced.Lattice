using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;


namespace PowerTables.Filters.Select
{
    /// <summary>
    /// Client configuration for select filter. 
    /// See <see cref="SelectFilterExtensions"/>
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
        /// Select filter value list
        /// </summary>
        public List<SelectListItem> Items { get; set; }
        
    }

    /// <summary>
    /// Select filter option
    /// </summary>
    public interface ISelectListItem
    {
        /// <summary>
        /// Is option disabled or not
        /// </summary>
        bool Disabled { get; set; }

        /// <summary>
        /// Is option selected by default
        /// </summary>
        bool Selected { get; set; }

        /// <summary>
        /// Option text
        /// </summary>
        string Text { get; set; }

        /// <summary>
        /// Option value
        /// </summary>
        string Value { get; set; }
    }

    
}
