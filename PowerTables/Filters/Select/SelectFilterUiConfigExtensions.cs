using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerTables.Filters.Select
{
    /// <summary>
    /// Extensions for Select Filter UI
    /// </summary>
    public static class SelectFilterUiConfigExtensions
    {
        /// <summary>
        /// Sets select items for filter UI
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="items">Select list with available values</param>
        /// <returns></returns>
        public static SelectFilterUiConfig SelectItems(this SelectFilterUiConfig config,
            IEnumerable<SelectListItem> items)
        {
            config.Items = items.ToList();
        }
    }
}
