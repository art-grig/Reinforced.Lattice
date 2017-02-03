using System.Web.Mvc;

namespace PowerTables.Templating
{
    /// <summary>
    /// Base template region for plugin
    /// </summary>
    public class PluginTemplateRegion : TemplateRegion, IProvidesEventsBinding, IProvidesMarking
    {
        public PluginTemplateRegion(IViewPlugins page, string id)
            : base(TemplateRegionType.Custom, page.Model.Prefix, id, page.Scope)
        {
        }

        
    }
}
