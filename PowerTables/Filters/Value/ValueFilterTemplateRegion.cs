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
        public string ExistingModel { get; private set; }

        public ValueFilterTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public interface IValueFilterModel
    {
        ValueFilterUiConfig Configuration { get; }
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
            return t.Datepicker(t.CleanValue(c => c.Configuration.ColumnName));
        }
    }
}
