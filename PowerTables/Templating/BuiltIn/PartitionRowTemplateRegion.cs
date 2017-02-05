using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.BuiltIn
{
    public class PartitionRowTemplateRegion : ModeledTemplateRegion<IRowModel<IPartitionRowTemplate>>,
        IProvidesEventsBinding, IProvidesTracking
    {
        public PartitionRowTemplateRegion(string prefix, string id, ITemplatesScope scope) : base(TemplateRegionType.Row, prefix, id, scope)
        {
        }

        public bool IsTrackSet { get; set; }
    }

    public interface IPartitionRowTemplate
    {
        int UiColumnsCount { get; }

        int AlreadyLoaded { get; }

        bool IsLoading { get; }

        bool IsSearchPending { get; }

        bool CanLoadMore { get; }
    }

    public static class PartitionRowTemplateExtensions
    {
        public static PartitionRowTemplateRegion PartitionRow(this ITemplatesScope t, string templateId = "partitionRow")
        {
            return new PartitionRowTemplateRegion(t.TemplatesPrefix, templateId, t);
        }

        public static SpecialString BindLoadMore(this PartitionRowTemplateRegion t,DOMEvent evt)
        {
            return t.BindEvent("loadMore", evt);
        }
    }
}
