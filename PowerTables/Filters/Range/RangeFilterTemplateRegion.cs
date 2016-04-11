﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Filters.Range
{
    public class RangeFilterTemplateRegion : PluginTemplateRegion, IModelProvider<IRangeFilterModel>, IProvidesDatepicker
    {
        public RangeFilterTemplateRegion(IViewPlugins page) : base(page, "rangeFilter")
        {
        }
    }
    public interface IRangeFilterModel
    {
        RangeFilterUiConfig Configuration { get; }
    }

    public static class RangeFilterTemplateExtensions
    {
        public static RangeFilterTemplateRegion RangeFilter(this IViewPlugins t)
        {
            return new RangeFilterTemplateRegion(t);
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
            return t.Datepicker(t.CleanValue(c => c.Configuration.ColumnName));
        }
    }
}