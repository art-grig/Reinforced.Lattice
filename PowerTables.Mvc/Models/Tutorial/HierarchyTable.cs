using System.Linq;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Hierarchy;
using PowerTables.Plugins.Ordering;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<HierarchySource, SampleHierarchyItem> HierarchyTable(
            this Configurator<HierarchySource, SampleHierarchyItem> conf)
        {
            conf.Hierarchy(x=>x.ParentKey);
            conf.ProjectDataWith(c => c.Select(x=>new SampleHierarchyItem()
            {
                Id  = x.Id,
                Text  = x.Text,
                Link = x.Link,
                IconLink = x.IconLink,
                ChildrenCount = c.Count(v=>v.ParentId==x.Id),
                IsExpanded = true,
                ParentKey = x.ParentId
            }));

            conf.AppendEmptyFilters();
            conf.PrimaryKey(c => c.Id);
            conf.Column(c=>c.Id).DataOnly();
            conf.Column(c=>c.ParentKey).DataOnly();
            conf.Column(c => c.Text).Template(tpl =>
            {
                tpl.ReturnsIf("{ChildrenCount} <= 0", c => c.Tag("span").Offset().Content("{Text}"));

                tpl.ReturnsIf("{IsExpanded}",
                    c =>
                        c.Tag("span")
                            .Content(
                                v =>
                                    v.Tag("span")
                                        .Class("glyphicon glyphicon-chevron-down _treeToggle")
                                        .Css("cursor", "pointer")
                                        .After(" {Text}"))
                            .Offset());
                tpl.Returns(
                    c =>
                        c.Tag("span")
                            .Content(
                                v =>
                                    v.Tag("span")
                                        .Class("glyphicon glyphicon-chevron-right _treeToggle")
                                        .Css("cursor", "pointer")
                                        .After(" {Text}"))
                            .Offset());
            }).ToggleEvent("click", "._treeToggle");

            ;
            conf.Column(c => c.Text).OrderableUi(c => c.UseClientOrdering().DefaultOrdering(Ordering.Descending)).FilterValueUi(c=>c.ClientFiltering());
            return conf;
        }

        private static Template Offset(this Template tpl)
        {
            tpl.Css("padding-left", "`{Deepness}*10`px");
            return tpl;
        }
    }

    public class SampleHierarchyItem : IHierarchyItem
    {
        public int Id { get; set; }
        public int ChildrenCount { get; set; }
        public bool IsExpanded { get; set; }
        public int ParentKey { get; set; }
        
        public string Text { get; set; }

        public string Link { get; set; }

        public string IconLink { get; set; }
    }

    public class HierarchySource
    {
        public int Id { get; set; }

        public int ParentId { get; set; }

        public string Text { get; set; }

        public string Link { get; set; }

        public string IconLink { get; set; }

        public int Order { get; set; }
    }
}