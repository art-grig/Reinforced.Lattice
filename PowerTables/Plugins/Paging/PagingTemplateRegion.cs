using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

    public class PagingGotoPageTemplate : HbTagRegion
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

        int PageNumber { get; }
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

    }
}
