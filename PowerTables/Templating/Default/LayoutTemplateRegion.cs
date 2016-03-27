using System.IO;

namespace PowerTables.Templating
{
    public class LayoutTemplateRegion : TemplateRegion, IProvidesEventsBinding
    {
        public LayoutTemplateRegion(string prefix, TextWriter writer)
            : base(prefix, "layout", writer)
        {
        }
    }
}