using System;
using System.IO;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Paging
{
    public class PagingTemplateRegion :
        PluginTemplateRegion
        , IModelProvider<IPagingViewModel>
    {


        public string ExistingModel { get; private set; }

        public PagingTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public class PagingArrowsModeTemplate : CodeBlock, IProvidesEventsBinding, IModelProvider<IArrowModeViewModel>
    {
        public PagingArrowsModeTemplate(IRawProvider writer)
            : base("if(o.Configuration.ArrowsMode){","}", writer)
        {
        }

        public string ExistingModel { get; private set; }
        public TextWriter Writer { get { return null; } }
    }

    public class PagingPeriodsModeTemplate : CodeBlock, IProvidesEventsBinding, IModelProvider<IPeriodsModeViewModel>
    {
        public PagingPeriodsModeTemplate(IRawProvider writer)
            : base("if(!o.Configuration.ArrowsMode){", "}", writer)
        {
        }

        public string ExistingModel { get; private set; }
        public TextWriter Writer { get; }
    }

    public class PagingGotoPageTemplate : CodeBlock, IProvidesMarking, IProvidesEventsBinding, IProvidesVisualState
    {
        public PagingGotoPageTemplate(IRawProvider writer)
            : base("if(o.Configuration.UseGotoPage){", "}", writer)
        {
        }

        public TextWriter Writer { get; }
    }

    public interface IPagingViewModel
    {
        PagingClientConfiguration Configuration { get; }
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
        [OverrideTplFieldName("CurrentPage()")]
        int CurrentPage { get; }
        [OverrideTplFieldName("TotalPages()")]
        int TotalPages { get; }
        [OverrideTplFieldName("PageSize()")]
        int PageSize { get; }
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

        [OverrideTplFieldName("DisPage()")]
        string DisPage { get; }
    }

    public static class PagingTeplatesExtensions
    {
        public static PagingTemplateRegion Paging(this IViewPlugins t, string templateId = "paging")
        {
            return new PagingTemplateRegion(t, templateId);
        }


        public static PagingArrowsModeTemplate ArrowsMode(this PagingTemplateRegion pr)
        {
            return new PagingArrowsModeTemplate(pr);
        }

        public static PagingPeriodsModeTemplate PeriodsMode(this PagingTemplateRegion pr)
        {
            return new PagingPeriodsModeTemplate(pr);
        }

        public static PagingGotoPageTemplate GotoPage(this PagingTemplateRegion pr)
        {
            return new PagingGotoPageTemplate(pr);
        }

        public static SpecialString BindNextPage(this PagingTemplateRegion t, string eventId)
        {
            return t.BindEvent("nextClick", eventId);
        }

        public static SpecialString BindPreviousPage(this PagingTemplateRegion t, string eventId)
        {
            return t.BindEvent("previousClick", eventId);
        }

        public static SpecialString BindNavigateToPage(this PagingTemplateRegion t, string eventId, string pageNumber)
        {
            return t.BindEvent("navigateToPage", eventId, pageNumber);
        }

        public static SpecialString BindNavigateToPage<T>(this T t, string eventId)
            where T : IModelProvider<IPageViewModel>, IProvidesEventsBinding
        {
            return t.BindEvent<T, IPageViewModel, int>("navigateToPage", eventId, c => c.Page);
        }


        public static SpecialString BindGotoPage(this PagingGotoPageTemplate t, string eventId)
        {
            return t.BindEvent("gotoPageClick", eventId);
        }

        public static SpecialString BindValidateGotoPage(this PagingGotoPageTemplate t, string eventId)
        {
            return t.BindEvent("validateGotopage", eventId);
        }

        public static SpecialString WhenEnteredPageInvalid(this PagingGotoPageTemplate t, Action<VisualState> state)
        {
            return t.State("invalid", state);
        }

        public static SpecialString ThisIsGotopageInput (this PagingGotoPageTemplate t)
        {
            return t.Mark("GotoInput");
        }

    }
}
