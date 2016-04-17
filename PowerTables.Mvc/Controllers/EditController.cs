using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PowerTables.Editors;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Controllers
{
    public partial class TutorialController
    {
        [Tutorial("Editing data", 12)]
        public ActionResult Editor()
        {
            return TutPage(c => c.Editor());
        }

        public ActionResult EditorHandle()
        {
            var t = Table();
            t.Editor();
            var handler = new PowerTablesHandler<Toy, Row>(t);
            handler.AddEditHandler(EditData);
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);
        }

        private void EditData(PowerTablesData<Toy, Row> powerTablesData, EditionResultWrapper<Row> edit)
        {
            edit.ConfirmedObject.Name = edit.ConfirmedObject.Name + " - Edited";
            edit.ConfirmedObject.TypeOfToy = ToyType.Dolls;

            var idsToUpdate = new[] { 2750, 2747, 2744 };
            var src = Data.SourceData.Where(c => idsToUpdate.Contains(c.Id)).ToArray();
            var mapped = powerTablesData.Configuration.MapRange(src);
            foreach (var row in mapped)
            {
                row.Name = "UFO edited this label";
                row.IsPaid = true;
            }
            edit.Adjustments.AddOrUpdate(mapped);
        }
    }
}