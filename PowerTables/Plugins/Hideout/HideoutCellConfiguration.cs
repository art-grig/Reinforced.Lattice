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
        /// Columns hidout settings
        /// Key = column RawName, Value = true when hidden, false when shown
        /// </summary>
        public Dictionary<string,bool> HiddenColumns { get; set; }

        public HideoutPluginConfiguration()
        {
            HiddenColumns = new Dictionary<string, bool>();
        }
    }
}
