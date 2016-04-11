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
        public ResponseInfoTemplateRegion(IViewPlugins page) : base(page, "responseInfo")
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IResponseInfoDefaultData
    {
        int CurrentlyShown { get; }

        int TotalLocal { get; }

        int TotalServer { get; }

        bool IsLocalRequest { get; }

        int TotalPages { get; }

        int CurrentPage { get; }

        bool PagingEnabled { get; }
    }

    public static class ResponseInfoTemplateExtensions
    {
        public static ResponseInfoTemplateRegion<T> ResponseInfo<T>(this IViewPlugins t)
        {
            return new ResponseInfoTemplateRegion<T>(t);
        }

        public static ResponseInfoTemplateRegion<IResponseInfoDefaultData> ResponseInfo(this IViewPlugins t)
        {
            return new ResponseInfoTemplateRegion<IResponseInfoDefaultData>(t);
        }
    }
}
