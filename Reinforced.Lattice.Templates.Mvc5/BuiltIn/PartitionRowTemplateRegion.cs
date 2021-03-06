﻿using Reinforced.Lattice.Configuration.Json;
using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates.BuiltIn
{
    public class PartitionRowTemplateRegion : ModeledTemplateRegion<IRowModel<IPartitionRowData>>,
        IProvidesEventsBinding, IProvidesMarking
    {
        public PartitionRowTemplateRegion(string prefix, string id, ITemplatesScope scope) : base(TemplateRegionType.Partition, prefix, id, scope)
        {
        }
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

    public interface IPartitionRowData
    {
        [OverrideTplFieldName("UiColumnsCount()")]
        int UiColumnsCount { get; }

        [OverrideTplFieldName("IsLoading()")]
        bool IsLoading { get; }

        [OverrideTplFieldName("Stats()")]
        IStatsModel Stats { get; }

        [OverrideTplFieldName("IsClientSearchPending()")]
        bool IsClientSearchPending { get; }

        [OverrideTplFieldName("CanLoadMore()")]
        bool CanLoadMore { get; }

        [OverrideTplFieldName("LoadAhead()")]
        int LoadAhead { get; }
    }

    public static class PartitionRowTemplateExtensions
    {
        public static PartitionRowTemplateRegion PartitionIndication(this ITemplatesScope t, string templateId = "partitionIndication")
        {
            return new PartitionRowTemplateRegion(t.TemplatesPrefix, templateId, t);
        }

        public static Inline BindLoadMore(this PartitionRowTemplateRegion t, DOMEvent evt)
        {
            return t.BindEvent("loadMore", evt);
        }

        public static Inline ThisIsAdditionalPagesInput(this PartitionRowTemplateRegion t)
        {
            return t.Mark("PagesInput");
        }
    }
}
