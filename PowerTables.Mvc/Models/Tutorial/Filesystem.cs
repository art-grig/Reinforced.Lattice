﻿using System;
using System.IO;
using System.Linq;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Value;
using PowerTables.Mvc.Extensions;
using PowerTables.Plugins.Checkboxify;
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
                    ParentKey = Path.GetDirectoryName(x.FullName) == "C:\\Program Files (x86)" ? null : Path.GetDirectoryName(x.FullName),
                    Name = x.Name,
                    CreationDate = x.CreationTime,
                    Size = (x.Attributes & FileAttributes.Directory) == FileAttributes.Directory ? (long?)null :
                    (new FileInfo(x.FullName)).Length

                }
            ));

            conf.Checkboxify();
            conf.AppendEmptyFilters();
            conf.PrimaryKey(c => c.FullPath);
            conf.Column(c => c.FullPath).DataOnly();
            conf.Column(c => c.ParentKey).DataOnly();
            conf.Column(c => c.IsDirectory).DataOnly();
            conf.Column(c => c.CreationDate).FormatDateWithDateformatJs("dd mmm yyyy");
            conf.Column(c => c.Name).Template(tpl =>
            {
                tpl.ReturnsIf("{ChildrenCount} <= 0", c => c.IconAndName().Offset().Loading());

                tpl.ReturnsIf("{IsExpanded}",
                    c =>
                        c.Tag("span")
                            .Content(
                                v =>
                                    v.Tag("span")
                                        .Class("glyphicon glyphicon-chevron-down _treeToggle")
                                        .Css("cursor", "pointer")
                                        .After(x => x.IconAndName()))
                            .Offset().Loading());
                tpl.Returns(
                    c =>
                        c.Tag("span")
                            .Content(
                                v =>
                                    v.Tag("span")
                                        .Class("glyphicon glyphicon-chevron-right _treeToggle")
                                        .Css("cursor", "pointer")
                                        .After(x => x.IconAndName()))
                            .Offset().Loading());
            }).BindHierarchyToggleLoad("click", "._treeToggle");

            conf.Partition(x => x.Client().InitialSkipTake(take: 15));
            conf.Scrollbar(x => x.Vertical());
            return conf;
        }
        private static Template IconAndName(this Template tpl)
        {
            tpl.Tag("span").Content("<img src='/Tutorial/GetIcon?path={FullPath}' /> {Name}");
            return tpl;
        }

        private static Template Loading(this Template tpl)
        {
            tpl.After("`(({IsLoading})?'<i>Loading...</i>':'')`");
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

        public DateTime CreationDate { get; set; }

        public long? Size { get; set; }
    }

}