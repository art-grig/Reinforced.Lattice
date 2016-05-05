using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.Reload
{
    /// <summary>
    /// Client configuration for Reload plugin
    /// </summary>
    public class ReloadUiConfiguration : IProvidesTemplate
    {
        /// <summary>
        /// Should table be reloaded forcibly
        /// </summary>
        public bool ForceReload { get; set; }

        /// <summary>
        /// Selector where to render reload button 
        /// </summary>
        public string RenderTo { get; set; }

        public string DefaultTemplateId { get { return "reload"; } }
    }
}
