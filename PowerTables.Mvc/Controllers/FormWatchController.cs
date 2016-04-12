using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using PowerTables.Configuration;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Mvc.Controllers
{
    public partial class TutorialController
    {
        [Tutorial("Form watcher", 9, "Views/Tutorial/FormWatch.cshtml", "Controllers/FormWatchController.cs")]
        public ActionResult FormWatchForm()
        {
            var vm = new FormWatchTutorialModel()
            {
                ValuesForIcloudlock = new[]
                {
                    new SelectListItem(){Text = "On",Value = "On"},
                    new SelectListItem(){Text = "Off",Value = "Off"},
                    new SelectListItem(){Text = "Not matter",Value = "Notmatter"},
                },
                Types = EnumHelper.GetSelectList(typeof(SomeType)),
                Table = new Configurator<SourceData, TargetData>().FormWatchForm().Url(Url.Action("FormWatchFormHandle"))
            };
            return View("FormWatch",vm);
        }

        public ActionResult FormWatchFormHandle()
        {
            var table = new Configurator<SourceData, TargetData>().FormWatchForm();
            var handler = new PowerTablesHandler<SourceData, TargetData>(table);

            var request = handler.ExtractRequest(ControllerContext);
            //var formValues = request.Form<FormWatchTutorialModel>();

            var q = Data.SourceData.AsQueryable();

            //if (!string.IsNullOrEmpty(formValues.GroupNamePart))
            //{
            //    q = q.Where(c => c.VeryName.StartsWith(formValues.GroupNamePart));
            //}

            return handler.Handle(q, ControllerContext);
        }
    }
}