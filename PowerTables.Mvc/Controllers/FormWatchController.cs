using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using PowerTables.Configuration;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;

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
            return Handle(c => c.FormWatchForm());
        }
    }
}