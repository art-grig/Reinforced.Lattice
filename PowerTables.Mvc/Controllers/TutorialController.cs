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
        private static readonly Dictionary<string, TutorialAttribute> TutorialMethods = new Dictionary<string, TutorialAttribute>();
        static TutorialController()
        {
            var tutorialMethods = typeof(TutorialController).GetMethods()
                .Where(c => c.GetCustomAttribute<TutorialAttribute>() != null)
                .OrderBy(c => c.GetCustomAttribute<TutorialAttribute>().Partial);

            TutorialMethods = tutorialMethods
                .ToDictionary(c => c.Name, v => v.GetCustomAttribute<TutorialAttribute>());
            int i = 1;
            foreach (var tutorialAttribute in TutorialMethods)
            {
                tutorialAttribute.Value.TutorialNumber = i;
                i++;
                tutorialAttribute.Value.TutorialId = tutorialAttribute.Key;
            }


        }
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

            TutorialAttribute attrs = null;
            if (TutorialMethods.ContainsKey(filterContext.ActionDescriptor.ActionName))
            {
                attrs = TutorialMethods[filterContext.ActionDescriptor.ActionName];
            }
            if (attrs != null)
            {
                TutorialAttribute currentTutorial = attrs;
                ViewBag.CurrentTutorial = currentTutorial;
                _tutorialId = filterContext.ActionDescriptor.ActionName;

                ViewBag.Code = GetCode(_tutorialId, currentTutorial.TutorialNumber);

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
                TutorialMethods
                    .Select(c => c.Value).OrderBy(v => v.TutorialNumber).ToList();
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
            var file = Server.MapPath(string.Format("~/Models/Tutorial/{0}.cs", tutorialId));
            var fileText = System.IO.File.ReadAllText(file);
            return fileText.Trim();
        }

        public ActionResult Index()
        {
            return View();
        }

        [Tutorial("Basic setup", "Models/Data/Data.cs", "Views/Tutorial/BaseTutorial.cshtml")]
        public ActionResult Basic()
        {
            return TutPage(c => c.Basic());
        }

        public ActionResult BasicHandle()
        {
            return Handle(c => c.Basic());
        }

        [Tutorial("Projection, Titles and .DataOnly")]
        public ActionResult ProjectionTitlesAndDataOnly()
        {
            return TutPage(c => c.ProjectionTitlesAndDataOnly());
        }

        public ActionResult ProjectionTitlesAndDataOnlyHandle()
        {
            return Handle(c => c.ProjectionTitlesAndDataOnly());
        }

        [Tutorial("Ordering and Loading inidicator")]
        public ActionResult OrderingAndLoadingInidicator()
        {
            return TutPage(c => c.OrderingAndLoadingInidicator());
        }

        public ActionResult OrderingAndLoadingInidicatorHandle()
        {
            return Handle(c => c.OrderingAndLoadingInidicator());
        }

        [Tutorial("Messages and immediate loading")]
        public ActionResult Messages()
        {
            return TutPage(c => c.Messages());
        }

        public ActionResult MessagesHandle()
        {
            return Handle(c => c.Messages());
        }

        [Tutorial("Pagination and limiting")]
        public ActionResult PaginationAndLimiting()
        {
            return TutPage(c => c.Pagination());
        }

        public ActionResult PaginationAndLimitingHandle()
        {
            Thread.Sleep(500);
            return Handle(c => c.Pagination());
        }

        [Tutorial("Client-side pagination and limiting")]
        public ActionResult ClientPagination()
        {
            return TutPage(c => c.ClientPagination());
        }

        public ActionResult ClientPaginationHandle()
        {
            return Handle(c => c.ClientPagination());
        }

        [Tutorial("Filtering", "/Views/Shared/Datepicker.cshtml")]
        public ActionResult Filtering()
        {
            return TutPage(c => c.Filtering());
        }

        public ActionResult FilteringHandle()
        {
            return Handle(c => c.Filtering());
        }

        [Tutorial("Filters shuffling")]
        public ActionResult RedirectingFilters()
        {
            return TutPage(c => c.RedirectingFilters());
        }

        public ActionResult RedirectingFiltersHandle()
        {
            return Handle(c => c.RedirectingFilters());
        }


        [Tutorial("Buttons for server commands")]
        public ActionResult ButtonsForCommands()
        {
            return TutPage(c => c.ButtonsForCommands());
        }

        public ActionResult ButtonsForCommandsHandle()
        {
            return Handle(c => c.ButtonsForCommands());
        }

        [Tutorial("Hideout and ResponseInfo")]
        public ActionResult HideoutAndResponseInfo()
        {
            return TutPage(c => c.HideoutAndResponseInfo());
        }

        public ActionResult HideoutAndResponseInfoHandle()
        {
            return Handle(c => c.HideoutAndResponseInfo());
        }

        [Tutorial("Client totals")]
        public ActionResult ClientTotals()
        {
            return TutPage(c => c.ClientTotals());
        }

        public ActionResult ClientTotalsHandle()
        {
            return Handle(c => c.ClientTotals());
        }

        [Tutorial("Scrollbar Test")]
        public ActionResult ScrollbarTest()
        {
            return TutPage(c => c.ScrollbarTest());
        }

        public ActionResult ScrollbarTestHandle()
        {
            return Handle(c => c.ScrollbarTest());
        }


        [Tutorial("Table with hierarchy")]
        public ActionResult HierarchyTable()
        {
            var t = new Configurator<HierarchySource, SampleHierarchyItem>().HierarchyTable().Url(Url.Action("HierarchyTableHandle"));
            return View("BaseTutorial", t);
        }

        public ActionResult HierarchyTableHandle()
        {
            var t = new Configurator<HierarchySource, SampleHierarchyItem>().HierarchyTable();
            var handler = t.CreateMvcHandler(ControllerContext);
            Random r = new Random();

            var data = new List<HierarchySource>()
            {
                new HierarchySource(){Id = 1,Link = "http://goog.com",Text = "Cars",ParentId = null},
                new HierarchySource(){Id = 2,Link = "http://goog.com",Text = "Hatchback",ParentId = 1},
                new HierarchySource(){Id = 3,Link = "http://goog.com",Text = "Hard Trucks",ParentId = 1},
                new HierarchySource(){Id = 4,Link = "http://goog.com",Text = "Mercedes",ParentId = 2},
                new HierarchySource(){Id = 5,Link = "http://goog.com",Text = "Opel",ParentId = 2},
                new HierarchySource(){Id = 6,Link = "http://goog.com",Text = "Bears  (childless)",ParentId = null},
                new HierarchySource(){Id = 7,Link = "http://goog.com",Text = "Foxes (childless)",ParentId = null},
                new HierarchySource(){Id = 8,Link = "http://goog.com",Text = "Sweets",ParentId = null},
                new HierarchySource(){Id = 9,Link = "http://goog.com",Text = "Pies",ParentId = 8},
                new HierarchySource(){Id = 10,Link = "http://goog.com",Text = "Candies",ParentId = 8},
                new HierarchySource(){Id = 11,Link = "http://goog.com",Text = "Cakes",ParentId = 8},
                new HierarchySource(){Id = 12,Link = "http://goog.com",Text = "Lolipops",ParentId = 8},
                new HierarchySource(){Id = 13,Link = "http://goog.com",Text = "Crab Candy",ParentId = 10},
                new HierarchySource(){Id = 14,Link = "http://goog.com",Text = "Lick Candy",ParentId = 10},
                new HierarchySource(){Id = 15,Link = "http://goog.com",Text = "Russian one",ParentId = 13},
            };
            foreach (var hierarchySource in data)
            {
                hierarchySource.Order = r.Next(25);
            }
            return handler.Handle(data.OrderBy(c => r.Next(10) > 5).AsQueryable());
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
            var handler = t.CreateMvcHandler(ControllerContext);
            //Thread.Sleep(1500); // simulate working
            return handler.Handle(Data.SourceData.AsQueryable());
        }
        #endregion
    }
}