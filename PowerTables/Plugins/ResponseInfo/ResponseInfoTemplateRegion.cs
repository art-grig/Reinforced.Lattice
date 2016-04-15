using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Templating;

namespace PowerTables.Plugins.ResponseInfo
{
    public class ResponseInfoTemplateRegion<T> : PluginTemplateRegion, IModelProvider<T>
    {
        

        public string ExistingModel { get; private set; }

        public ResponseInfoTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public interface IResponseInfoDefaultData
    {
        int CurrentlyShown { get; }

        int TotalCount { get; }

        bool IsLocalRequest { get; }

        int TotalPages { get; }

        int CurrentPage { get; }

        bool PagingEnabled { get; }
    }

    public static class ResponseInfoTemplateExtensions
    {
        public static ResponseInfoTemplateRegion<T> ResponseInfo<T>(this IViewPlugins t, string templateId = "responseInfo")
        {
            return new ResponseInfoTemplateRegion<T>(t,templateId);
        }

        public static ResponseInfoTemplateRegion<IResponseInfoDefaultData> ResponseInfo(this IViewPlugins t, string templateId = "responseInfo")
        {
            return new ResponseInfoTemplateRegion<IResponseInfoDefaultData>(t, templateId);
        }
    }
}
