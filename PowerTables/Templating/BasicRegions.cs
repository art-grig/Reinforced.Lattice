using System;
using System.IO;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating
{
    public class LayoutTemplateRegion : TemplateRegion, IProvidesEventsBinding
    {
        public LayoutTemplateRegion(string prefix, TextWriter writer)
            : base(prefix, "layout", writer)
        {
        }
    }

    public class PluignWrapperTemplateRegion : 
        ModeledTemplateRegion<PluignWrapperTemplateRegion.PluginWrapperModel>, 
        IProvidesEventsBinding,
        IProvidesTracking,
        IProvidesContent
    {
        public PluignWrapperTemplateRegion(string prefix, TextWriter writer)
            : base(prefix, "pluginWrapper", writer)
        {
        }

        public class PluginWrapperModel
        {
            [OverrideHbFieldName("lt")]
            public bool IsLeftTop { get; set; } 

            [OverrideHbFieldName("rt")]
            public bool IsRightTop { get; set; } 

            [OverrideHbFieldName("lb")]
            public bool IsLeftBottom { get; set; } 

            [OverrideHbFieldName("rb")]
            public bool IsRightBottom { get; set; } 
        }

        public bool IsTrackSet { get; set; }

        public override void Dispose()
        {
            if (!IsTrackSet) throw new Exception("Tracking element required for plugin wrapper");
            base.Dispose();
        }
    }

    public class ColumnParametrizedTemplateRegion : ModeledTemplateRegion<ColumnConfiguration>, 
        IProvidesEventsBinding, 
        IProvidesColumnContent,
        IProvidesTracking, 
        IProvidesContent
    {
        public ColumnParametrizedTemplateRegion(string prefix, string id, TextWriter writer)
            : base(prefix, id, writer)
        {
        }

        public bool IsTrackSet { get; set; }
    }

    public class FilterParametrizedTemplateRegion : ModeledTemplateRegion<ColumnFilterConfiguration>,
        IProvidesEventsBinding,
        IProvidesColumnContent,
        IProvidesTracking,
        IProvidesContent
    {
        public FilterParametrizedTemplateRegion(string prefix, string id, TextWriter writer)
            : base(prefix, id, writer)
        {
        }

        public bool IsTrackSet { get; set; }
    }
}
