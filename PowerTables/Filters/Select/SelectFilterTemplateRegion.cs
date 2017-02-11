using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;
using PowerTables.Templating.Compilation;

namespace PowerTables.Filters.Select
{
    public class SelectFilterTemplateRegion : PluginTemplateRegion, IModelProvider<ISelectFilterModel>
    {
        public string ExistingModel { get; private set; }

        public SelectFilterTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public interface ISelectFilterModel
    {
        SelectFilterUiConfig Configuration { get; }
        IColumn AssociatedColumn { get; }
    }

    public static class SelectFilterTemplateExtensions
    {
        /// <summary>
        /// Template for Select filter
        /// </summary>
        /// <param name="t"></param>
        /// <param name="templateId">Filter Template Id. Default is selectFilter</param>
        public static SelectFilterTemplateRegion SelectFilter(this IViewPlugins t, string templateId = "selectFilter")
        {
            return new SelectFilterTemplateRegion(t, templateId);
        }

        /// <summary>
        /// Specified event on specified HTML element will lead to Select filter value changed
        /// </summary>
        /// <param name="t"></param>
        /// <param name="eventId">DOM Event ID</param>
        public static SpecialString BindValueChanged(this SelectFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        /// <summary>
        /// Points HTML element that provides value for filter. 
        /// It must have "value" property
        /// </summary>
        /// <param name="t"></param>
        public static SpecialString ThisIsFilterValueProvider(this SelectFilterTemplateRegion t)
        {
            return t.Mark("FilterValueProvider");
        }
    }
}
