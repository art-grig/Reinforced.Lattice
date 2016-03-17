using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Defaults;
using PowerTables.Mvc.Models;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.Hideout;

namespace PowerTables.Mvc.Controllers
{
    public class HomeController : Controller
    {

        private static List<SourceData> _sourceData;
        static HomeController()
        {

            #region Data
            _sourceData = new List<SourceData>()
            {
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
            };
            Random r = new Random();
            for (int i = 0; i < _sourceData.Count; i++)
            {
                _sourceData[i].Id = i;
                _sourceData[i].IcloudLock = r.Next(0, 10) > 3;
                _sourceData[i].ItemsCount = r.Next(10, 500);
                _sourceData[i].Cost = r.NextDouble() * 1000;
            }
            #endregion
        }

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            AboutViewModel avm = new AboutViewModel() { Configuration = new Configurator<SourceData, TargetData>().Configure() };
            avm.Statics = new RequestStaticData() { SomeBool = true, SomeDate = DateTime.Today, SomeId = 12345, SomeString = "Hello!" };
            ViewBag.Message = "Your application description page.";
            return View(avm);
        }

        public ActionResult HandleTable()
        {
            var handler = new PowerTablesHandler<SourceData, TargetData>(new Configurator<SourceData, TargetData>().Configure());
            var statData = handler.ExtractStaticData<RequestStaticData>(ControllerContext);

            var req = handler.ExtractRequest(ControllerContext);
            var shown = req.GetShownColumns();
            var hidden = req.GetHiddenColumns();
            var form = req.Form<AdditionalSearchData>();

            handler.AddCommandHandler("remove", Delete);
            handler.AddCommandHandler("download", DownloadSome);
            Thread.Sleep(1000);
            return handler.Handle(_sourceData.AsQueryable(), ControllerContext);
        }

        public FileResult DownloadSome(PowerTablesData<SourceData, TargetData> request)
        {
            return File(@"K:\Temp\mr-101-20150608-002.csv", "text/csv");
        }

        public OperationResult Delete(PowerTablesData<SourceData, TargetData> request)
        {
            int[] selectedIds = request.Request.GetSelectionIds<int>();
            var rc = _sourceData.RemoveAll(c => selectedIds.Contains(c.Id));
            return new OperationResult() { Message = String.Format("All went ok. {0} items removed", rc), Success = true };
        }

        public class OperationResult
        {
            public bool Success { get; set; }

            public string Message { get; set; }
        }

        public ActionResult HandleEnum(SimpleViewModel enumValue)
        {
            return null;
        }

        public class SimpleViewModel
        {
            public SampleEnum SampleEnum { get; set; }
        }
        public enum SampleEnum : byte
        {
            One = 1,
            Two = 2,
            Three = 3
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}