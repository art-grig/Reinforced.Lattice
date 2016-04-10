using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Plugins.Limit;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Paging
{
    public class PagingTemplateRegion :
        PluginTemplateRegion
        , IModelProvider<IPagingViewModel>
    {
        public PagingTemplateRegion(IViewPlugins page)
            : base(page, "paging")
        {
        }
    }

    public class PagingArrowsModeTemplate : HbTagRegion, IProvidesEventsBinding, IModelProvider<IArrowModeViewModel>
    {
        public PagingArrowsModeTemplate(TextWriter writer)
            : base("if", "Configuration.ArrowsMode", writer)
        {
        }
    }

    public class PagingPeriodsModeTemplate : HbTagRegion, IProvidesEventsBinding, IModelProvider<IPeriodsModeViewModel>
    {
        public PagingPeriodsModeTemplate(TextWriter writer)
            : base("unless", "Configuration.ArrowsMode", writer)
        {
        }
    }

    public class PagingGotoPageTemplate : HbTagRegion, IProvidesMarking, IProvidesEventsBinding
    {
        public PagingGotoPageTemplate(TextWriter writer)
            : base("if", "Configuration.UseGotoPage", writer)
        {
        }
    }

    public interface IPagingViewModel
    {
        bool Shown { get; }
    }

    public interface IPeriodsModeViewModel
    {
        IHbArray<IPageViewModel> Pages { get; }
    }


    public interface IArrowModeViewModel
    {
        bool PrevArrow { get; }
        bool NextArrow { get; }
    }

    public interface IPagingConfiguration
    {
        bool ArrowsMode { get; }

        bool UseGotoPage { get; }
    }

    public interface IPageViewModel
    {
        bool First { get; }
        bool Prev { get; }
        bool Period { get; }

        bool ActivePage { get; }

        bool InActivePage { get; }

        bool Next { get; }

        bool Last { get; }

        int Page { get; }

        string DisPage { get; }
    }

    public static class PagingTeplatesExtensions
    {
        public static PagingTemplateRegion Paging(this IViewPlugins t)
        {
            return new PagingTemplateRegion(t);
        }


        public static PagingArrowsModeTemplate ArrowsMode(this PagingTemplateRegion pr)
        {
            return new PagingArrowsModeTemplate(pr.Writer);
        }

        public static PagingPeriodsModeTemplate PeriodsMode(this PagingTemplateRegion pr)
        {
            return new PagingPeriodsModeTemplate(pr.Writer);
        }

        public static PagingGotoPageTemplate GotoPage(this PagingTemplateRegion pr)
        {
            return new PagingGotoPageTemplate(pr.Writer);
        }

        public static MvcHtmlString BindNextPage(this PagingTemplateRegion t, string eventId)
        {
            return t.BindEvent("nextClick", eventId);
        }

        public static MvcHtmlString BindPreviousPage(this PagingTemplateRegion t, string eventId)
        {
            return t.BindEvent("previousClick", eventId);
        }

        public static MvcHtmlString BindNavigateToPage(this PagingTemplateRegion t, string eventId, string pageNumber)
        {
            return t.BindEvent("navigateToPage", eventId, pageNumber);
        }

        public static MvcHtmlString BindNavigateToPage<T>(this T t, string eventId)
            where T : IModelProvider<IPageViewModel>, IProvidesEventsBinding
        {
            return t.BindEvent<T, IPageViewModel, int>("navigateToPage", eventId, c => c.Page);
        }

        public static MvcHtmlString ThisIsGotoPanel(this PagingGotoPageTemplate t)
        {
            return t.Mark("GotoPanel");
        }

        public static MvcHtmlString ThisIsGotoPageButton(this PagingGotoPageTemplate t)
        {
            return MvcHtmlString.Create(t.Mark("GotoBtn") + " " + t.BindEvent("click", "gotoPageClick"));
        }

        public static MvcHtmlString ThisIsGotoPageTextbox(this PagingGotoPageTemplate t)
        {
            return MvcHtmlString.Create(t.Mark("GotoInput") + " " + t.BindEvent("keyup", "validateGotopage"));
        }

    }
}
