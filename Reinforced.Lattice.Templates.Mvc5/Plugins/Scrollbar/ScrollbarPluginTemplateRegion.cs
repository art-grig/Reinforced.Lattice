﻿using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates.Plugins.Scrollbar
{
    public class ScrollbarPluginTemplateRegion : PluginTemplateRegion, IModelProvider<IScrollbarModel>
    {
        public ScrollbarPluginTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
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