using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Templating;

namespace PowerTables.Plugins.MouseSelect
{
    public class MouseSelectTemplateRegion : PluginTemplateRegion
    {
        public MouseSelectTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public static class MouseTemplateRegionExtensions
    {
        public static MouseSelectTemplateRegion MouseSelect(this IViewPlugins t, string templateId = "mouseSelect")
        {
            return new MouseSelectTemplateRegion(t, templateId);
        }
    }
}
