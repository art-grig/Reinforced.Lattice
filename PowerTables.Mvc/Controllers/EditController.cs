using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PowerTables.Adjustments;
using PowerTables.Defaults;
using PowerTables.Editing;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Controllers
{
    public partial class TutorialController
    {
        [Tutorial("Editing data", 2)]
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
            handler.AddCommandHandler("Test", TestSelection);
            return handler.Handle(Data.SourceData.AsQueryable(), ControllerContext);
        }

        private TableAdjustment TestSelection(PowerTablesData<Toy, Row> data)
        {
            var selectdCells = data.ExtendedSelection()
                .Select(c => c.SelectedObject.Id + ": " + string.Join(", ", c.SelectedColumnNames));

            var selectionData = string.Join("\n", selectdCells);

            return
                data.Configuration.Adjust(
                    x => x.Message(TableMessage.User("info", "Selection", selectionData)));
        }

        private TableAdjustment EditData(PowerTablesData<Toy, Row> powerTablesData, Row edit)
        {
            var selection = powerTablesData.Selection();
            var exSelection = powerTablesData.ExtendedSelection();

            if (edit.Id == 0)
            {
                edit.Id = Data.SourceData.Count + 1;
                Data.SourceData.Add(new Toy()
                {
                    CreatedDate = edit.CreatedDate,
                    Id = edit.Id,
                    DeliveryDelay = edit.DeliveryDelay,
                    ToyName = edit.Name + " Added"
                });
                return powerTablesData.Configuration.Adjust(x =>
                {
                    x.Message(TableMessage.User("info", "Object added", "Successfull"));
                    x.Update(edit);
                });

            }
            edit.Name = edit.Name + " - Edited";
            edit.TypeOfToy = ToyType.Dolls;

            var idsToUpdate = new[] { 2750, 2747, 2744 };
            var src = Data.SourceData.Where(c => idsToUpdate.Contains(c.Id)).ToArray();
            var mapped = powerTablesData.Configuration.MapRange(src);
            foreach (var row in mapped)
            {
                row.Name = "UFO edited this label";
                row.IsPaid = true;
            }
            return powerTablesData.Configuration.Adjust(x =>
            {
                x.Message(TableMessage.User("info", "Objects were updated", "Successful"));
                x.Update(mapped);
                x.Update(edit);
            });
        }
    }
}