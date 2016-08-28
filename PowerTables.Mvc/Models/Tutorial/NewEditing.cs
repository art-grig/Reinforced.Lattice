using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.Configuration;
using PowerTables.Editing;
using PowerTables.Editing.Cells;
using PowerTables.Editing.Editors.Check;
using PowerTables.Editing.Editors.PlainText;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> NewEditing(this Configurator<Toy, Row> conf)
        {
            conf.EditingCells(c =>
            {
                c.EditCheck(v => v.IsPaid).Mandatory();
                c.EditPlainText(v => v.SupplierAddress).CanTypeEmpty().ValidationRegex("aa");
            });

            return conf;
        }
    }
}