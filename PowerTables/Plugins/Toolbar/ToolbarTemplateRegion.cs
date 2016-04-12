using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarTemplateRegion : PluginTemplateRegion, IModelProvider<IToolbarViewModel>
    {
        public ToolbarTemplateRegion(IViewPlugins page) : base(page, "toolbar")
        {
        }

        public string ExistingModel { get; private set; }
    }

    public class ButtonsSetTemplateRegion : HbTagRegion
        ,IModelProvider<ToolbarButtonClientConfiguration>
        ,IProvidesMarking
        ,IProvidesEventsBinding
    {
        public ButtonsSetTemplateRegion(TextWriter writer) : base("each", "Configuration.Buttons", writer)
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IToolbarViewModel
    {
        ToolbarButtonsClientConfiguration Configuration { get; }
    }

    public static class ToolbarTemplatingExtensions
    {
        public static ToolbarTemplateRegion Toolbar(this IViewPlugins t)
        {
            return new ToolbarTemplateRegion(t);
        }

        public static ButtonsSetTemplateRegion Buttons(this ToolbarTemplateRegion t)
        {
            return new ButtonsSetTemplateRegion(t.Writer);
        }

        public static MvcHtmlString BindButton(this ButtonsSetTemplateRegion m, string eventId)
        {
            var mark = m.Mark("AllButtons",m.CleanValue(c=>c.InternalId));
            var events = m.BindEvent("buttonHandleEvent", eventId, m.CleanValue(c => c.InternalId));
            return MvcHtmlString.Create(mark + " " + events);
        }
    }

}
