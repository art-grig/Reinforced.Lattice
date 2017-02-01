using PowerTables.Configuration;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Models
{
    public static class TestTable
    {
        public const string Remove = "remove";
        public const string Download = "download";
        public const string ExportSelected = "export-selected";
        public const string ExportAll = "export-selected";

        public static Configurator<Toy, Row> Configure(this Configurator<Toy, Row> conf)
        {
            conf.Url("/Home/HandleTable");
            //conf.WatchForm<AdditionalSearchData>(c =>
            //{
            //    c.WatchAllFields();
            //    c.Field(f => f.MinimumCost).TriggerSearchOnEvents("change", "keyup");
            //    c.Field(f => f.GroupNamePart).Selector("._part").TriggerSearchOnEvents("change", "keyup");
            //});

            ////conf.FreeOrdering(c => Ordering.Ascending.TupleIfNot(Ordering.Neutral), c => c.VeryName);
            //conf.FreeFilter(c => c.Form<AdditionalSearchData>().GroupNamePart.TupleIfNotNull(), (s, a) => s.Where(c => c.VeryName.StartsWith(a)));
            
            //conf.Column(c=>c.SomethingDataOnly).DataOnly();
            //conf.Column(c => c.BehindProperty).Title("Behind");

            //conf
            //    .DatePicker(new DatepickerOptions("createDatePicker", "putDateToDatepicker", "getDateFromDatepicker"))
            //    .Limit(
            //        ui => ui.PlaceAt("lt").Configuration.Values(new[] {"Every", "-", "5", "10", "-", "50", "100"}, "10"))
            //    .Paging(ui => ui.Configuration.PagingSimple(useFirstLasPage: true, useGotoPage: true))
               
            //    .LoadingIndicator()
            //    .HideoutMenu(c => c.IncludeAll().Except(a => a.Id), ui => ui.PlaceAt("lt"))
            //    .Checkboxify(c => c.Id, selectAllBehavior: SelectAllBehavior.InvolveServer)
                //.WithResponseInfo(a => new ResponseInfo()
                //{
                //    QueryTime = DateTime.Now.ToString("dd MMM yyyy"),
                //    Shown = a.Mapped.Value.Length,
                //    TotalRecords = a.ResultsCount
                //}, ui =>
                //{
                //    ui.Configuration.TemplateText = ResponseInfo.ResponseInfoTemplate;
                //})
                //.Totals(a => a
                //        .AddTotalFormat(c => c.ItemsCount, q => q.Paged.Any() ? q.Paged.Sum(c => c.ItemsCount) : 0, "Total: {v} pcs.")
                //        .AddTotalFormat(c => c.Cost, q => q.Paged.Any() ? Math.Round(q.Paged.Average(c => c.Cost), 2) : 0, "Avg.: {v} EUR"), showOnTop: true);
                ;

//            conf.ProjectDataWith(c => c.Select(q => new Row()
//            {
//                Cost = q.Cost,
//                CurrentDate = q.CreatedDate,
//                EnumValue = (SomeEnum)q.GroupType,
//                GroupName = q.VeryName,
//                IcloudLock = q.Paid,
//                Id = q.Id,
//                ItemsCount = q.ItemsCount,
//                NullableDate = q.LastSoldDate,
//                NullableValue = q.PreordersCount.GetValueOrDefault(0)
//            }));
//            conf.Column(c => c.Id).Hide();
//            conf.Column(c => c.IcloudLock)
//                .TextForBoolean("On", "Off")
//                .Title("iCloud Lock");

//            conf.Column(c => c.Cost).TemplateFunction("function (a) {return a.Cost + ' EUR';}")
//                .Orderable(c => c.Cost)
//                .FilterRange(c => c.Cost, ui =>
//                {
//                    ui.Configuration.FromPlaceholder = "Min. Cost";
//                    ui.Configuration.ToPlaceholder = "Max. Cost";
//                });

//            conf.Column(c => c.ItemsCount)
//                .Title("Items count")
//                .TemplateFunction(@"
//                    function(a) { 
//                        var  templ = null;
//    
//                        if (a.ItemsCount<1000) templ = {Green: true};
//                        if (a.ItemsCount<250) templ = {Orange: true};
//                        if (a.ItemsCount<100) templ = {Red: true};
//                        templ.Value = a.ItemsCount;
//                        var template = Handlebars.compile($('#rangeValue').html());
//                        return template(templ);
//                    }")
//                .FilterValue(c => c.ItemsCount, ui =>
//                {
//                    ui.Configuration.Placeholder = "Minimum cost";
//                    ui.Configuration.DefaultValue = conf.ToFilterDefaultString(50);
//                })
//                .By((a, v) => a.Where(c => c.Cost >= v));

//            conf.Column(c => c.GroupName)
//                .Orderable(c => c.VeryName)
//                .FilterValue(c => c.VeryName, ui =>
//                {
//                    ui.Configuration.DefaultValue = conf.ToFilterDefaultString("Alpha");
//                });

//            conf.Column(c => c.EnumValue)
//                .Hide()
//                .FormatEnumWithDisplayAttribute()
//                .FilterMultiSelect(c => c.GroupType, ui => ui.Configuration.SelectItems(EnumHelper.GetSelectList(typeof(SomeEnum))))
//                ;
//            conf.Column(c => c.CurrentDate).FormatDateWithDateformatJs().FilterValue(c => c.CreatedDate);
//            conf.Column(c => c.NullableValue).FilterRange(c => c.PreordersCount ?? 0);
//            conf.Column(c => c.NullableDate).FormatDateWithDateformatJs().FilterRange(c => c.LastSoldDate.GetValueOrDefault());

           
            return conf;
        }
    }
}