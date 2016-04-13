using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Defaults;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.Hideout;

namespace PowerTables.Mvc.Controllers
{
    public partial class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            //AboutViewModel avm = new AboutViewModel() { Configuration = new Configurator<SourceData, TargetData>().Configure() };
            //avm.Statics = new RequestStaticData() { SomeBool = true, SomeDate = DateTime.Today, SomeId = 12345, SomeString = "Hello!" };
            //ViewBag.Message = "Your application description page.";
            //return View(avm);

            return View("Index");
        }

        public ActionResult HandleTable()
        {
            var handler = new PowerTablesHandler<Toy, Row>(new Configurator<Toy, Row>().Configure());
            var statData = handler.ExtractStaticData<RequestStaticData>(ControllerContext);

            var req = handler.ExtractRequest(ControllerContext);
            var shown = req.GetShownColumns();
            var hidden = req.GetHiddenColumns();
            var form = req.Form<AdditionalSearchData>();

            handler.AddCommandHandler("remove", Delete);
            handler.AddCommandHandler("download", DownloadSome);
            Thread.Sleep(1000);
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);
        }

        public FileResult DownloadSome(PowerTablesData<Toy, Row> request)
        {
            return File(@"K:\Temp\mr-101-20150608-002.csv", "text/csv");
        }

        public OperationResult Delete(PowerTablesData<Toy, Row> request)
        {
            int[] selectedIds = request.Request.GetSelectionIds<int>();
            var rc = Data.SourceData.RemoveAll(c => selectedIds.Contains(c.Id));
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