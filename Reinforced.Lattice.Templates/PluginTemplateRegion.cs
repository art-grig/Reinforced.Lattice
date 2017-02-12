namespace Reinforced.Lattice.Templates
{
    /// <summary>
    /// Base template region for plugin
    /// </summary>
    public class PluginTemplateRegion : TemplateRegion, IProvidesEventsBinding, IProvidesMarking
    {
        public PluginTemplateRegion(IViewPlugins page, string id,TemplateRegionType type = TemplateRegionType.Custom)
            : base(type, page.Model.Prefix, id, page.Scope)
        {
        }

        
    }
}
