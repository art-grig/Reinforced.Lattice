using System.IO;
using System.Linq;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Hierarchy;
using PowerTables.Plugins.Ordering;
using PowerTables.Plugins.Scrollbar;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<FileSystemInfo, FileRow> Filesystem(
            this Configurator<FileSystemInfo, FileRow> conf)
        {
            conf.Hierarchy(x => x.ParentKey);
            conf.ProjectDataWith(c => c.Select(x =>

                new FileRow()
                {
                    IsExpanded = false,
                    ChildrenCount = (x.Attributes & FileAttributes.Directory) == FileAttributes.Directory ?
                                    Directory.GetFileSystemEntries(x.FullName).Length : 0,
                    FullPath = x.FullName,
                    IsDirectory = (x.Attributes & FileAttributes.Directory) == FileAttributes.Directory,
                    ParentKey = Path.GetDirectoryName(x.FullName) == "J:\\"? null : Path.GetDirectoryName(x.FullName),
                    Name = x.Name
                }
            ));

            conf.AppendEmptyFilters();
            conf.PrimaryKey(c => c.FullPath);
            conf.Column(c => c.FullPath).DataOnly();
            //conf.Column(c => c.ParentKey).DataOnly();
            conf.Column(c => c.IsDirectory).DataOnly();
            conf.Column(c => c.Name).Template(tpl =>
            {
                tpl.ReturnsIf("{ChildrenCount} <= 0", c => c.IconAndName().Offset());

                tpl.ReturnsIf("{IsExpanded}",
                    c =>
                        c.Tag("span")
                            .Content(
                                v =>
                                    v.Tag("span")
                                        .Class("glyphicon glyphicon-chevron-down _treeToggle")
                                        .Css("cursor", "pointer")
                                        .After(x => x.IconAndName()))
                            .Offset());
                tpl.Returns(
                    c =>
                        c.Tag("span")
                            .Content(
                                v =>
                                    v.Tag("span")
                                        .Class("glyphicon glyphicon-chevron-right _treeToggle")
                                        .Css("cursor", "pointer")
                                        .After(x => x.IconAndName()))
                            .Offset());
            }).BindHierarchyToggleLoad("click", "._treeToggle");

            conf.Partition(x => x.Client().InitialSkipTake(take: 15));
            conf.Scrollbar(x => x.Vertical());
            return conf;
        }
        private static Template IconAndName(this Template tpl)
        {
            tpl.Tag("span").Content("<img src='/Tutorial/`({IsDirectory}?'DirIcon':'FileIcon')`' /> {Name}");
            return tpl;
        }
    }

    public class FileRow : IHierarchyItem
    {
        public string FullPath { get; set; }
        public int ChildrenCount { get; set; }
        public bool IsExpanded { get; set; }
        
        public bool IsDirectory { get; set; }
        public string Name { get; set; }
        public string ParentKey { get; set; }
    }

}