using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Hideout
{
    public class HideoutTemplateRegion : PluginTemplateRegion,
        IModelProvider<IHideoutViewModel>

    {
        public HideoutTemplateRegion(IViewPlugins page)
            : base(page, "hideout")
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IHideoutViewModel
    {
        HideoutPluginConfiguration Configuration { get; }
        IHbArray<IHideoutColumnState> ColumnStates { get; }

    }

    public interface IHideoutColumnState
    {
        bool Visible { get; }
        string RawName { get; }
        string Name { get; }
        bool DoesNotExists { get; }
    }

    public static class HideoutTemplateExtensions
    {
        public static HideoutTemplateRegion HideoutMenu(this IViewPlugins t)
        {
            return new HideoutTemplateRegion(t);
        }

        public static MvcHtmlString BindHide<T>(this T t,string eventId)
            where T : IModelProvider<IHideoutColumnState>, IProvidesEventsBinding
        {
            return t.BindEvent("hideColumn", eventId, t.CleanValue(c => c.RawName));
        }

        public static MvcHtmlString BindShow<T>(this T t, string eventId)
            where T : IModelProvider<IHideoutColumnState>, IProvidesEventsBinding
        {
            return t.BindEvent("showColumn", eventId, t.CleanValue(c => c.RawName));
        }

        public static MvcHtmlString BindToggle<T>(this T t, string eventId)
            where T : IModelProvider<IHideoutColumnState>, IProvidesEventsBinding
        {
            return t.BindEvent("toggleColumn", eventId, t.CleanValue(c => c.RawName));
        }
    }
}
