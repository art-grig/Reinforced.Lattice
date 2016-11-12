using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Filters.Value
{
    public class ValueFilterTemplateRegion : PluginTemplateRegion, IModelProvider<IValueFilterModel>, IProvidesDatepicker
    {
        public string ExistingModel { get; private set; }

        public ValueFilterTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public interface IValueFilterModel
    {
        ValueFilterUiConfig Configuration { get; }

        IColumn AssociatedColumn { get; }
    }

    public static class ValueFilterTemplateExtensions
    {
        public static ValueFilterTemplateRegion ValueFilter(this IViewPlugins t, string templateId = "valueFilter")
        {
            return new ValueFilterTemplateRegion(t, templateId);
        }

        public static MvcHtmlString BindValueChanged(this ValueFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        public static MvcHtmlString ThisIsFilterValueProvider(this ValueFilterTemplateRegion t)
        {
            return t.Mark("FilterValueProvider");
        }

        public static MvcHtmlString DatepickerCanBeHere(this ValueFilterTemplateRegion t)
        {
            return t.DatepickerIf(t.CleanValue(c => c.AssociatedColumn.IsDateTime), t.CleanValue(c => c.AssociatedColumn.Configuration.IsNullable));
        }
    }
}
