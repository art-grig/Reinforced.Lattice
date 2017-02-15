using Reinforced.Lattice.Filters.Range;
using Reinforced.Lattice.Templates.BuiltIn;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.Filters.Range
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

        public static Inline BindValueChanged(this RangeFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        public static Inline ThisIsFromField(this RangeFilterTemplateRegion t)
        {
            return t.Mark("FromValueProvider");
        }

        public static Inline ThisIsToField(this RangeFilterTemplateRegion t)
        {
            return t.Mark("ToValueProvider");
        }

        public static Inline DatepickerCanBeHere(this RangeFilterTemplateRegion t)
        {
            return t.DatepickerIf(t.Property(c => c.AssociatedColumn.IsDateTime), t.Property(c => c.AssociatedColumn.Configuration.IsNullable));
        }
    }
}
