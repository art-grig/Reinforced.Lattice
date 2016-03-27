using System;
using System.IO;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating
{
    public class PluignWrapperTemplateRegion : 
        ModeledTemplateRegion<PluignWrapperTemplateRegion.PluginWrapperModel>, 
        IProvidesEventsBinding,
        IProvidesContent
    {
        public PluignWrapperTemplateRegion(string prefix, TextWriter writer)
            : base(prefix, "pluginWrapper", writer)
        {
        }

        public class PluginWrapperModel
        {
            public PluginConfiguration Configuration { get; set; }
        }

        public bool IsTrackSet { get; set; }

        public override void Dispose()
        {
            if (!IsTrackSet) throw new Exception("Tracking element required for plugin wrapper");
            base.Dispose();
        }
    }
}