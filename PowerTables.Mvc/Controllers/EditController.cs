using System.Linq;
using System.Web.Mvc;
using PowerTables.Adjustments;
using PowerTables.Editing;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;
using PowerTables.Processing;
using Reinforced.Lattice.Mvc;

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
            var handler = t.CreateMvcHandler(ControllerContext);
            handler.AddEditHandler(EditData);
            handler.AddCommandHandler("Test", TestSelection);
            return handler.Handle(Data.SourceData.AsQueryable());
        }

        private TableAdjustment TestSelection(LatticeData<Toy, Row> data)
        {
            var selectdCells = data.ExtendedSelection()
                .Select(c => c.SelectedObject.Id + ": " + string.Join(", ", c.SelectedColumnNames));

            var selectionData = string.Join("\n", selectdCells);

            return
                data.Configuration.Adjust(
                    x => x.Message(LatticeMessage.User("info", "Selection", selectionData)));
        }

        private TableAdjustment EditData(LatticeData<Toy, Row> latticeData, Row edit)
        {
            var selection = latticeData.Selection();
            var exSelection = latticeData.ExtendedSelection();

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
                return latticeData.Configuration.Adjust(x =>
                {
                    x.Message(LatticeMessage.User("info", "Object added", "Successfull"));
                    x.Update(edit);
                });

            }
            edit.Name = edit.Name + " - Edited";
            edit.TypeOfToy = ToyType.Dolls;

            var idsToUpdate = new[] { 2750, 2747, 2744 };
            var src = Data.SourceData.Where(c => idsToUpdate.Contains(c.Id)).ToArray();
            var mapped = latticeData.Configuration.MapRange(src);
            foreach (var row in mapped)
            {
                row.Name = "UFO edited this label";
                row.IsPaid = true;
            }
            return latticeData.Configuration.Adjust(x =>
            {
                x.Message(LatticeMessage.User("info", "Objects were updated", "Successful"));
                x.Update(mapped);
                x.Update(edit);
            });
        }
    }
}