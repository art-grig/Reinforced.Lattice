using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Mvc.Models;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.Hideout;

namespace PowerTables.Mvc.Controllers
{
    public class TestsController : Controller
    {
        private Configurator<SourceData, TargetData> Table()
        {
            return new Configurator<SourceData, TargetData>();
        }

        public ActionResult Test1()
        {
            var model = Table().Test1();
            return View(model);
        }

        public ActionResult HandleTable()
        {
            var handler = new PowerTablesHandler<SourceData, TargetData>(Table().Test1());
            Thread.Sleep(1000);
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);
        }
    }
}