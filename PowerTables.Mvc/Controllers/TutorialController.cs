using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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

                ViewBag.Code = GetCode(_tutorialId);
                

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

        private string GetCode(string tutorialId)
        {
            var file = Server.MapPath(string.Format("~/Models/Tutorial/{0}.cs", tutorialId));
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

        #region Utility
        private ActionResult TutPage(Action<Configurator<SourceData, TargetData>> config)
        {
            var t = Table();
            config(t);
            return View(t);
        }

        private ActionResult Handle(Action<Configurator<SourceData, TargetData>> config)
        {
            var t = Table();
            config(t);
            var handler = new PowerTablesHandler<SourceData, TargetData>(t);
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);
        }
        #endregion
    }
}