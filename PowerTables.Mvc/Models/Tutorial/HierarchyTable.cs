using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Hierarchy;
using PowerTables.Plugins.Ordering;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<HierarchySource, SampleHierarchyItem> HierarchyTable(
            this Configurator<HierarchySource, SampleHierarchyItem> conf)
        {
            conf.Hierarchy();
            conf.ProjectDataWith(c => c.Select(x=>new SampleHierarchyItem()
            {
                Text  = x.Text,
                Link = x.Link,
                IconLink = x.IconLink,
                ChildrenCount = c.Count(v=>v.ParentId==x.Id),
                IsVisible = true,
                IsExpanded = true,
                ParentKey = x.ParentId.ToString(),
                RootKey = x.Id.ToString()
            }));

            conf.AppendEmptyFilters();
            conf.Column(c => c.Text).Template(tpl =>
            {
                tpl.ReturnsIf("{ChildrenCount} <= 0", c => c.Tag("span").Offset().Content("{Text}"));

                tpl.ReturnsIf("{IsExpanded}===true",
                    c =>
                        c.Tag("span")
                            .Content(
                                v => v.Tag("span").Class("glyphicon glyphicon-chevron-down").CollapseSubtree().Css("cursor", "pointer").After(" {Text}"))
                            .Offset());
                tpl.Returns(
                    c =>
                        c.Tag("span")
                            .Content(
                                v => v.Tag("span").Class("glyphicon glyphicon-chevron-right").ExpandSubtree().Css("cursor", "pointer").After(" {Text}"))
                            .Offset());
            });
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
        public bool IsVisible { get; set; }
        public bool IsExpanded { get; set; }
        public string RootKey { get; set; }
        public string ParentKey { get; set; }
        public string TreeOrder { get; private set; }
        public int Deepness { get; private set; }
        public bool IsLoading { get; private set; }

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