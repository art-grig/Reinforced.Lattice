using System.IO;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating
{
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
}