namespace Reinforced.Lattice.Templating.Plugins.MouseSelect
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
