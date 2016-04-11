using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PowerTables.Plugins.Hideout
{
    /// <summary>
    /// Client hideout plugin configuration
    /// </summary>
    public class HideoutPluginConfiguration
    {
        /// <summary>
        /// Show hideout menu or not
        /// </summary>
        public bool ShowMenu { get; set; }

        /// <summary>
        /// Columns that are hidable at all
        /// </summary>
        public List<string> HideableColumnsNames { get; set; }

        /// <summary>
        /// Columns initiating table reload when their hidden/shown state changes
        /// </summary>
        public List<string> ColumnInitiatingReload { get; set; }

        /// <summary>
        /// Columns hidout settings
        /// Key = column RawName, Value = true when hidden, false when shown
        /// </summary>
        public Dictionary<string,bool> HiddenColumns { get; set; }

        public HideoutPluginConfiguration()
        {
            HiddenColumns = new Dictionary<string, bool>();

            HideableColumnsNames = new List<string>();

            ColumnInitiatingReload = new List<string>();
        }
    }
}
