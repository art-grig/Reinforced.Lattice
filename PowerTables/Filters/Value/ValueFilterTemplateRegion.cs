using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Plugins.Limit;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Filters.Value
{
    public class ValueFilterTemplateRegion : PluginTemplateRegion, IModelProvider<IValueFilterModel>, IProvidesDatepicker
    {
        public ValueFilterTemplateRegion(IViewPlugins page) : base(page, "valueFilter")
        {
        }
    }

    public interface IValueFilterModel
    {
        ValueFilterUiConfig Configuration { get; }
    }

    public static class ValueFilterTemplateExtensions
    {
        public static ValueFilterTemplateRegion ValueFilter(this IViewPlugins t)
        {
            return new ValueFilterTemplateRegion(t);
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
            return t.Datepicker(t.CleanValue(c=>c.Configuration.ColumnName));
        }
    }
}
