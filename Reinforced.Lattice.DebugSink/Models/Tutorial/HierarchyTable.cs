﻿using System.Linq;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Filters;
using Reinforced.Lattice.Filters.Value;
using Reinforced.Lattice.Plugins.Hierarchy;
using Reinforced.Lattice.Plugins.Ordering;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
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
                IsExpanded = false,
                ParentKey = x.ParentId
            }));

            conf.AppendEmptyFilters();
            conf.PrimaryKey(c => c.Id);
            conf.Column(c=>c.Id).DataOnly();
            conf.Column(c=>c.ParentKey).DataOnly();
            conf.Column(c => c.Text).Template(tpl =>
            {
                tpl.ReturnsIf("{LocalChildrenCount} <= 0", c => c.Tag("span").Offset().Content("{Text}"));

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
            }).BindHierarchyToggle("click", "._treeToggle");

            ;
            conf.Column(c => c.Text).OrderableUi(c => c.UseClientOrdering().DefaultOrdering(Ordering.Descending)).FilterValueUi(c=>c.ClientFiltering());
            return conf;
        }

        private static Template Offset(this Template tpl)
        {
            tpl.Css("padding-left", "`{Deepness}*18`px");
            return tpl;
        }
    }

    public class SampleHierarchyItem : IHierarchyItem
    {
        public int Id { get; set; }
        public int ChildrenCount { get; set; }
        public bool IsExpanded { get; set; }
        public int? ParentKey { get; set; }
        
        public string Text { get; set; }

        public string Link { get; set; }

        public string IconLink { get; set; }
    }

    public class HierarchySource
    {
        public int Id { get; set; }

        public int? ParentId { get; set; }

        public string Text { get; set; }

        public string Link { get; set; }

        public string IconLink { get; set; }

        public int Order { get; set; }
    }
}