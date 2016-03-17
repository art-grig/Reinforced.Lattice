using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PowerTables.Plugins.Hideout
{
    /// <summary>
    /// Client configuration for Hideout plugin. 
    /// See <see cref="HideoutExtensions"/>
    /// </summary>
    public class HideoutClientConfiguration
    {
        public bool ShowMenu { get; set; }

        public List<string> HidebleColumnsNames { get; set; }

        public bool ReloadTableOnChangeHidden { get; set; }

    }
}
