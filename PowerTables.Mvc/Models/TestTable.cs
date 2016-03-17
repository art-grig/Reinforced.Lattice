using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc.Html;
using Newtonsoft.Json.Linq;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Multi;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.Hideout;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.Ordering;
using PowerTables.Plugins.Paging;
using PowerTables.Plugins.ResponseInfo;
using PowerTables.Plugins.Toolbar;
using PowerTables.Plugins.Total;

namespace PowerTables.Mvc.Models
{
    public static class TestTable
    {
        public const string Remove = "remove";
        public const string Download = "download";
        public const string ExportSelected = "export-selected";
        public const string ExportAll = "export-selected";

        public static ToolbarItemBuilder ShowMessageResponseCallback(this ToolbarItemBuilder tib)
        {
            const string fun = "function(t,r) { if (r.Message) alert(r.Message); t.getPlugin('Checkboxify').resetSelection();  t.reload(); }";
            tib.Configuration.CommandCallbackFunction = new JRaw(fun);
            return tib;
        }
        public static Configurator<SourceData, TargetData> Configure(this Configurator<SourceData, TargetData> conf)
        {
            conf.Url("/Home/HandleTable");
            conf.WatchForm<AdditionalSearchData>(c =>
            {
                c.WatchAllFields();
                c.Field(f => f.MinimumCost).TriggerSearchOnEvents("change", "keyup");
                c.Field(f => f.GroupNamePart).Selector("._part").TriggerSearchOnEvents("change", "keyup");
            });

            //conf.FreeOrdering(c => Ordering.Ascending.TupleIfNot(Ordering.Neutral), c => c.VeryName);
            conf.FreeFilter(c => c.Form<AdditionalSearchData>().GroupNamePart.TupleIfNotNull(), (s, a) => s.Where(c => c.VeryName.StartsWith(a)));
            
            conf.Column(c=>c.SomethingDataOnly).DataOnly();
            conf.Column(c => c.BehindProperty).Title("Behind");

            conf
                .DatePicker("function(v,f){ v.datepicker({ format: f, weekStart: 1 }); }", "mm/dd/yyyy", "MM/dd/yyyy")
                .Limit(new[] { "Every", "-", "5", "10", "-", "50", "100" }, "10", position: PluginPosition.LeftTop)
                .PagingSimple(useFirstLasPage: true, useGotoPage: true)
                .Toolbar(PluginPosition.RightTop, a =>
                {
                    //a.AddSimpleButton("filter".GlyphIcon() + "Toggle filters")
                    //    .Id("btnHideFilters")
                    //    .OnClick("function (t) { t.Renderer.toggleFilters(); }");

                    a.AddCommandButton("remove".GlyphIcon() + "Remove selected", Remove)
                        .DisableIfNothingChecked()
                        .ShowMessageResponseCallback();

                    a.AddCommandButton("download".GlyphIcon() + "Download", Download);

                    a.AddMenu("th".GlyphIcon() + "Excel export", b =>
                    {
                        b.AddCommandItem("star".GlyphIcon("left") + "Export all", ExportAll);
                        b.AddCommandItem("save".GlyphIcon("left") + "Export selected", ExportSelected).DisableIfNothingChecked();
                    }).Css("btn-primary");

                    a.AddMenuButton("record".GlyphIcon() + "And this is button menu", "something", b =>
                    {
                        b.AddSimpleItem("Simple active item").Css("active");
                        b.Separator();
                        b.AddSimpleItem("Simple inactive item");

                    }).Css("btn-primary");
                }
                    )
                .LoadingIndicator()
                .HideoutMenu(c => c.IncludeAll().Except(a => a.Id), reloadTableOnHide: true)
                .Checkboxify(c => c.Id, selectedClass: "warning", selectAllBehavior: SelectAllBehavior.InvolveServer, selectAllLocation: SelectAllLocation.FiltersHeader)
                .WithResponseInfo(a => new ResponseInfo()
                {
                    QueryTime = DateTime.Now.ToString("dd MMM yyyy"),
                    Shown = a.Mapped.Value.Length,
                    TotalRecords = a.ResultsCount
                }, ResponseInfo.ResponseInfoTemplate)
                .Totals(a => a
                        .AddTotalFormat(c => c.ItemsCount, q => q.Paged.Any() ? q.Paged.Sum(c => c.ItemsCount) : 0, "Total: {v} pcs.")
                        .AddTotalFormat(c => c.Cost, q => q.Paged.Any() ? Math.Round(q.Paged.Average(c => c.Cost), 2) : 0, "Avg.: {v} EUR"), showOnTop: true);

            conf.ProjectDataWith(c => c.Select(q => new TargetData()
            {
                Cost = q.Cost,
                CurrentDate = q.CurrentDate,
                EnumValue = (SomeEnum)q.GroupType,
                GroupName = q.VeryName,
                IcloudLock = q.IcloudLock,
                Id = q.Id,
                ItemsCount = q.ItemsCount,
                NullableDate = q.NullableDate,
                NullableValue = q.NullableValue.GetValueOrDefault(0)
            }));
            conf.Column(c => c.Id).Hide();
            conf.Column(c => c.IcloudLock)
                .TextForBoolean("On", "Off")
                .Title("iCloud Lock");

            conf.Column(c => c.Cost).ValueFunction("function (a) {return a.Cost + ' EUR';}")
                .Orderable(c => c.Cost, Ordering.Descending)
                .FilterRange(c => c.Cost, "Min. Cost", "Max. Cost");

            conf.Column(c => c.ItemsCount)
                .Title("Items count")
                .HtmlFunction(@"
                    function(a) { 
                        var  templ = null;
    
                        if (a.ItemsCount<1000) templ = {Green: true};
                        if (a.ItemsCount<250) templ = {Orange: true};
                        if (a.ItemsCount<100) templ = {Red: true};
                        templ.Value = a.ItemsCount;
                        var template = Handlebars.compile($('#rangeValue').html());
                        return template(templ);
                    }")
                .FilterValue(c => c.ItemsCount, "Minimum cost").Default(50)
                .By((a, v) => a.Where(c => c.Cost >= v));

            conf.Column(c => c.GroupName)
                .Orderable(c => c.VeryName)
                .FilterValue(c => c.VeryName).Default("Alpha");

            conf.Column(c => c.EnumValue)
                .Hide()
                .FormatEnumWithDisplayAttribute()
                .FilterMultiSelect(c => c.GroupType, EnumHelper.GetSelectList(typeof(SomeEnum)))
                ;
            conf.Column(c => c.CurrentDate).FormatDateWithDateformatJs().FilterValue(c => c.CurrentDate);
            conf.Column(c => c.NullableValue).FilterRange(c => c.NullableValue ?? 0);
            conf.Column(c => c.NullableDate).FormatDateWithDateformatJs().FilterRange(c => c.NullableDate.GetValueOrDefault());

            conf.Column(c => c.SomeCustomTemplate).Template(tmpl =>
            {
                tmpl.ReturnsIf("{GroupName} == 'Alpha'",
                    el =>
                        el.Tag("button")
                            .Class("btn btn-sm")
                            .Inside(icon => icon.Tag("span").Class("glyphicon glyphicon-time").After("Show GroupName"))
                            .OnClick("alert('{GroupName}');"));
            });
            return conf;
        }
    }
}