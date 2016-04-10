using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating
{
    /// <summary>
    /// Base template region for plugin
    /// </summary>
    public class PluginTemplateRegion : TemplateRegion, IProvidesEventsBinding, IProvidesMarking
    {
        public PluginTemplateRegion(IViewPlugins page, string id)
            : base(page.Model.Prefix, id, page.Writer)
        {
        }
    }
}
