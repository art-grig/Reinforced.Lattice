using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;

namespace PowerTables.Plugins.Ordering
{
    public class OrderingPluginTemplateRegion : PluginTemplateRegion,
        IModelProvider<IOrderingPluginModel>,
        IProvidesContent,
        IProvidesTracking
    {


        public bool IsTrackSet { get; set; }
        public string ExistingModel { get; private set; }

        public OrderingPluginTemplateRegion(IViewPlugins page, string id)
            : base(page, id,TemplateRegionType.Header)
        {
            
        }
    }

    /// <summary>
    /// Model for ordering plugin template
    /// </summary>
    public interface IOrderingPluginModel
    {
        /// <summary>
        /// Is ordering for current column ascending
        /// </summary>
        bool IsAscending { get; }

        /// <summary>
        /// Is ordering for current column descending
        /// </summary>
        bool IsDescending { get; }

        /// <summary>
        /// Is ordering for current column neutral
        /// </summary>
        bool IsNeutral { get; }

        /// <summary>
        /// Current column
        /// </summary>
        IColumn Column { get; }
    }

    public static class OrderingTemplateExtensions
    {
        /// <summary>
        /// Template region for ordering plugin. 
        /// Note that ordering plugin overrides header template for cells containing ordering, 
        /// so please try to make it look as much as possible similar to regular header template.
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static OrderingPluginTemplateRegion Ordering(this IViewPlugins t, string templateId = "ordering")
        {
            return new OrderingPluginTemplateRegion(t, templateId);
        }

        /// <summary>
        /// Binds switch ordering event triggers to current element
        /// </summary>
        /// <param name="p"></param>
        /// <param name="commaSeparatedEvents">DOM events</param>
        /// <returns></returns>
        public static SpecialString BindSwitchOrdering(this OrderingPluginTemplateRegion p, string commaSeparatedEvents)
        {
            return p.BindEvent("switchOrdering", commaSeparatedEvents);
        }

    }
}
