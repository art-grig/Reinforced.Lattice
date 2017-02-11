using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Templating;
using PowerTables.Templating.Compilation;

namespace PowerTables.Plugins.Scrollbar
{
    public class ScrollbarPluginTemplateRegion : PluginTemplateRegion, IModelProvider<IScrollbarModel>
    {
        public ScrollbarPluginTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }

        public string ExistingModel { get; }
    }

    public interface IScrollbarModel
    {
        bool IsVertical { get; }
    }

    public static class ScrollbarPluginTemplateExtensions
    {
        /// <summary>
        /// Template region for Reload plugin
        /// </summary>
        /// <param name="t"></param>
        /// <param name="templateId">Template ID</param>
        public static ScrollbarPluginTemplateRegion Scroll(this IViewPlugins t, string templateId = "scrollbar")
        {
            return new ScrollbarPluginTemplateRegion(t, templateId);
        }

        public static SpecialString ThisIsUpArrow(this ScrollbarPluginTemplateRegion t)
        {
            return t.Mark("UpArrow");
        }

        public static SpecialString ThisIsDownArrow(this ScrollbarPluginTemplateRegion t)
        {
            return t.Mark("DownArrow");
        }

        public static SpecialString ThisIsScroller(this ScrollbarPluginTemplateRegion t)
        {
            return t.Mark("Scroller");
        }

        public static SpecialString ThisIsScrollerActiveArea(this ScrollbarPluginTemplateRegion t)
        {
            return t.Mark("ScrollerActiveArea");
        }
    }
}
