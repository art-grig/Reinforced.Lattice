﻿using Reinforced.Lattice.Filters.Value;
using Reinforced.Lattice.Templates.BuiltIn;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.Filters.Value
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

        public static Inline BindValueChanged(this ValueFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        public static Inline ThisIsFilterValueProvider(this ValueFilterTemplateRegion t)
        {
            return t.Mark("FilterValueProvider");
        }

        public static Inline DatepickerCanBeHere(this ValueFilterTemplateRegion t)
        {
            return t.DatepickerIf(t.Property(c => c.AssociatedColumn.IsDateTime), t.Property(c => c.AssociatedColumn.Configuration.IsNullable));
        }
    }
}
