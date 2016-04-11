using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Filters.Value;
using PowerTables.Templating;

namespace PowerTables.Filters.Select
{
    public class SelectFilterTemplateRegion : PluginTemplateRegion, IModelProvider<ISelectFilterModel>
    {
        public SelectFilterTemplateRegion(IViewPlugins page) : base(page, "selectFilter")
        {
        }
    }

    public interface ISelectFilterModel
    {
        SelectFilterUiConfig Configuration { get; }
    }

    public static class SelectFilterTemplateExtensions
    {
        public static SelectFilterTemplateRegion SelectFilter(this IViewPlugins t)
        {
            return new SelectFilterTemplateRegion(t);
        }

        public static MvcHtmlString BindValueChanged(this SelectFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        public static MvcHtmlString ThisIsFilterValueProvider(this SelectFilterTemplateRegion t)
        {
            return t.Mark("FilterValueProvider");
        }
    }
}
