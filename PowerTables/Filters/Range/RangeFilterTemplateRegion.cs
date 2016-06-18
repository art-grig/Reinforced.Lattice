using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;
using PowerTables.Templating.Handlebars;

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

        public static MvcHtmlString BindValueChanged(this RangeFilterTemplateRegion t, string eventId)
        {
            return t.BindEvent("handleValueChanged", eventId);
        }

        public static MvcHtmlString ThisIsFromField(this RangeFilterTemplateRegion t)
        {
            return t.Mark("FromValueProvider");
        }

        public static MvcHtmlString ThisIsToField(this RangeFilterTemplateRegion t)
        {
            return t.Mark("ToValueProvider");
        }

        public static MvcHtmlString DatepickerCanBeHere(this RangeFilterTemplateRegion t)
        {
            return t.Datepicker(t.CleanValue(c => c.Configuration.ColumnName),true);
        }
    }
}
