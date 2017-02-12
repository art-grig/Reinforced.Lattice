using Reinforced.Lattice.Templates.BuiltIn;

namespace Reinforced.Lattice.Templates.Plugins.ResponseInfo
{
    public class ResponseInfoTemplateRegion<T> : PluginTemplateRegion, IModelProvider<T>
    {
        

        public string ExistingModel { get; private set; }

        public ResponseInfoTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public static class ResponseInfoTemplateExtensions
    {
        public static ResponseInfoTemplateRegion<T> ResponseInfo<T>(this IViewPlugins t, string templateId = "responseInfo")
        {
            return new ResponseInfoTemplateRegion<T>(t,templateId);
        }

        public static ResponseInfoTemplateRegion<IStatsModel> ResponseInfo(this IViewPlugins t, string templateId = "responseInfo")
        {
            return new ResponseInfoTemplateRegion<IStatsModel>(t, templateId);
        }
    }
}
