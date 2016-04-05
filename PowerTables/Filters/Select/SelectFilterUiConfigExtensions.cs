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
            return config;
        }

        /// <summary>
        /// Specifies raw default value for filter. This methods acts like .Default but consumes raw string 
        /// that will be put to filter box without any conversion. 
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="value">Raw value string</param>
        /// <returns>UI builder</returns>
        public static SelectFilterUiConfig RawDefault(this SelectFilterUiConfig config, string value)
        {
            config.Items.ForEach(c => c.Selected = false);
            if (value != null)
            {
                var selected = config.Items.FirstOrDefault(c => c.Value == value);
                if (selected != null)
                {
                    selected.Selected = true;
                }
                else
                {
                    throw new Exception(String.Format(
                        "Cannot find item in list with value '{0}' to make it default", value));
                }
            }
            return config;
        }
    }
}
