using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating.BuiltIn
{
    public class PartitionRowTemplateRegion : ModeledTemplateRegion<IRowModel<IPartitionRowTemplate>>,
        IProvidesEventsBinding, IProvidesTracking, IProvidesMarking
    {
        public PartitionRowTemplateRegion(string prefix, string id, ITemplatesScope scope) : base(TemplateRegionType.Row, prefix, id, scope)
        {
        }

        public bool IsTrackSet { get; set; }
    }

    public interface IStatsModel
    {
        [OverrideTplFieldName("IsSetFinite()")]
        bool IsSetFinite { get; }

        [OverrideTplFieldName("Mode()")]
        PartitionType Mode { get; }

        [OverrideTplFieldName("ServerCount()")]
        int ServerCount { get; }

        [OverrideTplFieldName("Stored()")]
        int Stored { get; }

        [OverrideTplFieldName("Filtered()")]
        int Filtered { get; }

        [OverrideTplFieldName("Displayed()")]
        int Displayed { get; }

        [OverrideTplFieldName("Ordered()")]
        int Ordered { get; }

        [OverrideTplFieldName("Skip()")]
        int Skip { get; }

        [OverrideTplFieldName("Take()")]
        int Take { get; }

        [OverrideTplFieldName("Pages()")]
        int Pages { get; }

        [OverrideTplFieldName("CurrentPage()")]
        int CurrentPage { get; }

        [OverrideTplFieldName("IsAllDataLoaded()")]
        bool IsAllDataLoaded { get; }

    }

    public interface IPartitionRowTemplate
    {
        int UiColumnsCount { get; }

        bool IsLoading { get; }

        IStatsModel Stats { get; }

        bool IsClientSearchPending { get; }

        bool CanLoadMore { get; }
    }

    public static class PartitionRowTemplateExtensions
    {
        public static PartitionRowTemplateRegion PartitionRow(this ITemplatesScope t, string templateId = "partitionRow")
        {
            return new PartitionRowTemplateRegion(t.TemplatesPrefix, templateId, t);
        }

        public static SpecialString BindLoadMore(this PartitionRowTemplateRegion t, DOMEvent evt)
        {
            return t.BindEvent("loadMore", evt);
        }

        public static SpecialString ThisIsAdditionalPagesInput(this PartitionRowTemplateRegion t)
        {
            return t.Mark("PagesInput");
        }
    }
}
