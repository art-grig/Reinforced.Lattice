using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Controllers
{
    public partial class TutorialController : Controller
    {
        private Configurator<Toy, Row> Table()
        {
            var conf = new Configurator<Toy, Row>();
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

                ViewBag.AdditionalCode = new Dictionary<Code, string>();
                foreach (var additionalCodeFile in currentTutorial.AdditionalCodeFiles)
                {
                    string code = GetCode(additionalCodeFile);
                    var codeobj = new Code(Path.GetFileName(additionalCodeFile), "html");
                    var ext = Path.GetExtension(additionalCodeFile);
                    switch (ext)
                    {
                        case ".cshtml":
                            codeobj.Language = "html";
                            break;
                        case ".cs":
                            codeobj.Language = "csharp";
                            break;
                    }
                    codeobj.Id = codeobj.File.Replace(".", "_");
                    ViewBag.AdditionalCode[codeobj] = code;
                }
            }
            List<TutorialAttribute> tutorials =
                typeof(TutorialController).GetMethods()
                    .Where(c => c.GetCustomAttribute<TutorialAttribute>() != null)
                    .Select(c =>
                    {
                        var ct = c.GetCustomAttribute<TutorialAttribute>();
                        ct.TutorialId = c.Name;
                        return ct;
                    }).OrderBy(v => v.TutorialNumber).ToList();
            ViewBag.Tutorials = tutorials;
        }
        private string GetCode(string path)
        {
            var file = Server.MapPath(string.Format("~/{0}", path));
            var fileText = System.IO.File.ReadAllText(file);
            return fileText.Trim();
        }
        private string GetCode(string tutorialId, int tutorialNumber)
        {
            var file = Server.MapPath(string.Format("~/Models/Tutorial/_{1}_{0}.cs", tutorialId, tutorialNumber));
            var fileText = System.IO.File.ReadAllText(file);
            return fileText.Trim();
        }

        public ActionResult Index()
        {
            return View();
        }

        [Tutorial("Basic setup", 1, "Models/Data/Data.cs", "Views/Tutorial/BaseTutorial.cshtml")]
        public ActionResult Basic()
        {
            return TutPage(c => c.Basic());
        }

        public ActionResult BasicHandle()
        {
            return Handle(c => c.Basic());
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

        [Tutorial("Client-side pagination and limiting", 6)]
        public ActionResult ClientPagination()
        {
            return TutPage(c => c.ClientPagination());
        }

        public ActionResult ClientPaginationHandle()
        {
            return Handle(c => c.ClientPagination());
        }

        [Tutorial("Filtering", 7, "/Views/Shared/Datepicker.cshtml")]
        public ActionResult Filtering()
        {
            return TutPage(c => c.Filtering());
        }

        public ActionResult FilteringHandle()
        {
            return Handle(c => c.Filtering());
        }

        [Tutorial("Redirecting Filters", 8)]
        public ActionResult RedirectingFilters()
        {
            return TutPage(c => c.RedirectingFilters());
        }

        public ActionResult RedirectingFiltersHandle()
        {
            return Handle(c => c.RedirectingFilters());
        }
        
        [Tutorial("Checkboxify and simple buttons", 9)]
        public ActionResult ButtonsAndCheckboxify()
        {
            return TutPage(c => c.ButtonsAndCheckboxify());
        }

        public ActionResult ButtonsAndCheckboxifyHandle()
        {
            return Handle(c => c.ButtonsAndCheckboxify());
        }

        [Tutorial("Buttons for server commands", 10)]
        public ActionResult ButtonsForCommands()
        {
            return TutPage(c => c.ButtonsForCommands());
        }

        public ActionResult ButtonsForCommandsHandle()
        {
            return Handle(c => c.ButtonsForCommands());
        }

        [Tutorial("Hideout and ResponseInfo", 14)]
        public ActionResult HideoutAndResponseInfo()
        {
            return TutPage(c => c.HideoutAndResponseInfo());
        }

        public ActionResult HideoutAndResponseInfoHandle()
        {
            return Handle(c => c.HideoutAndResponseInfo());
        }

        

        #region Utility
        private ActionResult TutPage(Action<Configurator<Toy, Row>> config)
        {
            var t = Table();
            config(t);
            return View("BaseTutorial", t);
        }

        private ActionResult Handle(Action<Configurator<Toy, Row>> config)
        {
            var t = Table();
            config(t);
            var handler = new PowerTablesHandler<Toy, Row>(t);
            //Thread.Sleep(500); // simulate working
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);
        }
        #endregion
    }
}