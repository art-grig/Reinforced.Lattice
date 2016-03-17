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
    public class SelectFilterClientConfig
    {
        public string SelectedValue { get; set; }

        public bool AllowSelectNothing { get; set; }

        public bool IsMultiple { get; set; }

        public string NothingText { get; set; }

        public List<SelectListItem> Items { get; set; }
        
    }

    
    public interface ISelectListItem
    {
        bool Disabled { get; set; }
        bool Selected { get; set; }
        string Text { get; set; }
        string Value { get; set; }

    }

    
}
