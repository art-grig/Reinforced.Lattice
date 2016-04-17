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
            
        }
    }
}