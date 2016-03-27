using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating
{
    /// <summary>
    /// Template region for plugin
    /// </summary>
    public class PluginTemplateRegion : TemplateRegion,IProvidesTracking
    {
        public PluginTemplateRegion(string prefix, string id, TextWriter writer) : base(prefix, id, writer)
        {
        }

        public bool IsTrackSet { get; set; }
    }
}
