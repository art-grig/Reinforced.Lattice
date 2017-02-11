using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;
using PowerTables.Templating.Compilation;
using PowerTables.Templating.Expressions;

namespace PowerTables.Filters.Range
{
    public class RangeFilterTemplateRegion : PluginTemplateRegion, IModelProvider<IRangeFilterModel>, IProvidesDatepicker
    {
        
        public string ExistingModel { get; private set; }

        public RangeFilterTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }
    public interface IRangeFilterModel
    {
        RangeFilterUiConfig Configuration { get; }
        IColumn AssociatedColumn { get; }
    }

    public static class RangeFilterTemplateExtensions
    {
        public static RangeFilterTemplateRegion RangeFilter(this IViewPlugins t, string templateId = "rangeFilter")
        {
            return new RangeFilterTemplateRegion(t,templateId);
        }

        public static SpecialString BindValueChanged(this RangeFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        public static SpecialString ThisIsFromField(this RangeFilterTemplateRegion t)
        {
            return t.Mark("FromValueProvider");
        }

        public static SpecialString ThisIsToField(this RangeFilterTemplateRegion t)
        {
            return t.Mark("ToValueProvider");
        }

        public static SpecialString DatepickerCanBeHere(this RangeFilterTemplateRegion t)
        {
            return t.DatepickerIf(t.Property(c => c.AssociatedColumn.IsDateTime), t.Property(c => c.AssociatedColumn.Configuration.IsNullable));
        }
    }
}
