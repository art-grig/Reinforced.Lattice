using System.IO;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating
{
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
