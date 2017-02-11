using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;
using PowerTables.Templating.Compilation;
using PowerTables.Templating.Expressions;

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

        public static SpecialString BindValueChanged(this ValueFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        public static SpecialString ThisIsFilterValueProvider(this ValueFilterTemplateRegion t)
        {
            return t.Mark("FilterValueProvider");
        }

        public static SpecialString DatepickerCanBeHere(this ValueFilterTemplateRegion t)
        {
            return t.DatepickerIf(t.Property(c => c.AssociatedColumn.IsDateTime), t.Property(c => c.AssociatedColumn.Configuration.IsNullable));
        }
    }
}
