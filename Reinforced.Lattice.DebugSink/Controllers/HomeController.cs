using System;
using System.Linq;
using System.Threading;
using System.Web.Mvc;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.DebugSink.Models;
using Reinforced.Lattice.DebugSink.Models.Data;
using Reinforced.Lattice.DebugSink.Models.Tutorial;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Plugins.Formwatch;
using Reinforced.Lattice.Plugins.Hideout;
using Reinforced.Lattice.Processing;

namespace Reinforced.Lattice.DebugSink.Controllers
{
    public partial class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            
            return View("Index");
        }

        public ActionResult HandleTable()
        {
            var handler = new Configurator<Toy, Row>().Configure().CreateMvcHandler(ControllerContext);
            var statData = handler.ExtractStaticData<RequestStaticData>();

            var req = handler.ExtractRequest();
            var shown = req.GetShownColumns();
            var hidden = req.GetHiddenColumns();
            var form = req.Form<AdditionalSearchData>();

            handler.AddCommandHandler("remove", Delete);
            handler.AddCommandHandler("download", DownloadSome);
            Thread.Sleep(1000);
            return handler.Handle(Data.SourceData.AsQueryable());
        }

        public FileResult DownloadSome(LatticeData<Toy, Row> request)
        {
            return File(@"K:\Temp\mr-101-20150608-002.csv", "text/csv");
        }

        public OperationResult Delete(LatticeData<Toy, Row> request)
        {
            int[] selectedIds = request.Selection().Select(c=>c.Id).ToArray();
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