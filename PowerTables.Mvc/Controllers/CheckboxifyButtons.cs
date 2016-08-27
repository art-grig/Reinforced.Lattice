using System;
using System.Collections.Generic;
using System.Data.Entity.Core.Metadata.Edm;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PowerTables.Defaults;
using PowerTables.Editing;
using PowerTables.Editors;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Toolbar;

namespace PowerTables.Mvc.Controllers
{
    public partial class TutorialController
    {
        [Tutorial("Checkboxify and simple buttons",1)]
        public ActionResult ButtonsAndCheckboxify()
        {
            return TutPage(c => c.ButtonsAndCheckboxify());
        }

        public ActionResult ButtonsAndCheckboxifyHandle()
        {
            var t = Table();
            t.ButtonsAndCheckboxify();
            var handler = new PowerTablesHandler<Toy, Row>(t);
            handler.AddCommandHandler(Tutorial.Remove,RemoveSelected);
            handler.AddCommandHandler(Tutorial.Update, UpdateSelected);
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);            
        }

        private TableUpdateResult RemoveSelected(PowerTablesData<Toy, Row> arg)
        {
            EditionResult er = new EditionResult();
            var editResultWrapper = new EditionResultWrapper<Row>(er);
            var selected = arg.Request.GetSelectionIds<int>();
            foreach (var i in selected)
            {
                editResultWrapper.Adjustments.Remove(new Row() {Id = i});
            }
            return new TableUpdateResult(editResultWrapper);
        }

        private TableUpdateResult UpdateSelected(PowerTablesData<Toy, Row> arg)
        {
            var form = arg.Request.ConfirmationForm<SimpleConfirmationModel>();
            EditionResult er = new EditionResult();
            var editResultWrapper = new EditionResultWrapper<Row>(er);
            var selected = arg.Request.GetSelectionIds<int>();
            foreach (var i in selected)
            {
                var data = Data.SourceData.Single(c => c.Id == i);
                data.ToyName = form.ToyName;
                data.GroupType = form.ToyType.Value;

                editResultWrapper.Adjustments.AddOrUpdate(arg.Configuration.Map(data));
            }
            return new TableUpdateResult(editResultWrapper);
        }
    }
}