﻿using System.Linq;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.DebugSink.Models.Data;
using Reinforced.Lattice.DebugSink.Models.Tutorial;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Plugins.Formwatch;

namespace Reinforced.Lattice.DebugSink.Controllers
{
    public partial class TutorialController
    {
        [Tutorial("Form watcher",3, "Views/Tutorial/FormWatch.cshtml", "Controllers/FormWatchController.cs")]
        public ActionResult FormWatchForAdditionalData()
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
                Table = new Configurator<Toy, Row>().FormWatchForAdditionalData().Url(Url.Action("FormWatchForAdditionalDataHandle"))
            };
            return View("FormWatch",vm);
        }

        public ActionResult FormWatchForAdditionalDataHandle()
        {
            var table = new Configurator<Toy, Row>().FormWatchForAdditionalData();
            var handler = table.CreateMvcHandler(ControllerContext);

            var request = handler.ExtractRequest();
            var formValues = request.Form<FormWatchTutorialModel>();
            var id = formValues.IdFrom;

            var q = Data.SourceData.AsQueryable();

            //if (!string.IsNullOrEmpty(formValues.GroupNamePart))
            //{
            //    q = q.Where(c => c.VeryName.StartsWith(formValues.GroupNamePart));
            //}

            return handler.Handle(q);
        }
    }
}