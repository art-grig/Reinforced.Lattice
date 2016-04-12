using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Controllers
{
    public class TutorialController : Controller
    {
        private Configurator<SourceData, TargetData> Table()
        {
            var conf = new Configurator<SourceData, TargetData>();
            if (!string.IsNullOrEmpty(_tutorialId))
            {
                conf.Url(Url.Action(string.Format("{0}Handle", _tutorialId)));
            }
            return conf;
        }

        private string _tutorialId;

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            
            var attrs = filterContext.ActionDescriptor.GetCustomAttributes(typeof(TutorialAttribute), true);
            if (attrs.Length != 0)
            {
                TutorialAttribute currentTutorial = attrs[0] as TutorialAttribute;
                ViewBag.CurrentTutorial = currentTutorial;
                _tutorialId = filterContext.ActionDescriptor.ActionName;

                ViewBag.Code = GetCode(_tutorialId,currentTutorial.TutorialNumber);


                List<TutorialAttribute> tutorials =
                typeof(TutorialController).GetMethods()
                    .Where(c => c.GetCustomAttribute<TutorialAttribute>() != null)
                    .Select(c =>
                    {
                        var ct = c.GetCustomAttribute<TutorialAttribute>();
                        ct.TutorialId = c.Name;
                        return ct;
                    }).ToList();
                ViewBag.Tutorials = tutorials;
            }
        }

        private string GetCode(string tutorialId, int tutorialNumber)
        {
            var file = Server.MapPath(string.Format("~/Models/Tutorial/_{1}_{0}.cs", tutorialId, tutorialNumber));
            var fileText = System.IO.File.ReadAllText(file);
            return fileText.Trim();
        }

        [Tutorial("Basic setup", 1)]
        public ActionResult Basic()
        {
            return TutPage(c => TestTables.Basic(c));
        }

        public ActionResult BasicHandle()
        {
            return Handle(c => TestTables.Basic(c));
        }

        [Tutorial("Projection, Titles and .DataOnly", 2)]
        public ActionResult ProjectionTitlesAndDataOnly()
        {
            return TutPage(c => c.ProjectionTitlesAndDataOnly());
        }

        public ActionResult ProjectionTitlesAndDataOnlyHandle()
        {
            return Handle(c => c.ProjectionTitlesAndDataOnly());
        }

        [Tutorial("Ordering and Loading inidicator", 3)]
        public ActionResult OrderingAndLoadingInidicator()
        {
            return TutPage(c => c.OrderingAndLoadingInidicator());
        }

        public ActionResult OrderingAndLoadingInidicatorHandle()
        {
            return Handle(c => c.OrderingAndLoadingInidicator());
        }

        [Tutorial("Messages and immediate loading", 4)]
        public ActionResult Messages()
        {
            return TutPage(c => c.Messages());
        }

        public ActionResult MessagesHandle()
        {
            return Handle(c => c.Messages());
        }

        [Tutorial("Pagination and limiting", 5)]
        public ActionResult PaginationAndLimiting()
        {
            return TutPage(c => c.Pagination());
        }

        public ActionResult PaginationAndLimitingHandle()
        {
            return Handle(c => c.Pagination());
        }

        [Tutorial("Filtering", 6)]
        public ActionResult Filtering()
        {
            return TutPage(c => c.Filtering());
        }

        public ActionResult FilteringHandle()
        {
            return Handle(c => c.Filtering());
        }
        
        [Tutorial("Hideout, Response info and Totals", 7)]
        public ActionResult HideoutAndResponseInfo()
        {
            return TutPage(c => c.HideoutAndResponseInfo());
        }

        public ActionResult HideoutAndResponseInfoHandle()
        {
            return Handle(c => c.HideoutAndResponseInfo());
        }

        #region Utility
        private ActionResult TutPage(Action<Configurator<SourceData, TargetData>> config)
        {
            var t = Table();
            config(t);
            return View("BaseTutorial", t);
        }

        private ActionResult Handle(Action<Configurator<SourceData, TargetData>> config)
        {
            var t = Table();
            config(t);
            var handler = new PowerTablesHandler<SourceData, TargetData>(t);
            //Thread.Sleep(500); // simulate working
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);
        }
        #endregion
    }
}