namespace Reinforced.Lattice.Templates.Plugins.LoadingOverlap
{
    public class LoadingOverlapTemplatesRegion : PluginTemplateRegion
    {
        public LoadingOverlapTemplatesRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public static class LoadingOverlapTemplateExtensions
    {
        public static LoadingOverlapTemplatesRegion LoadingOverlap(this IViewPlugins t,
            string templateId = "loadingOverlap")
        {
            return new LoadingOverlapTemplatesRegion(t,templateId);
        }
    }
}
