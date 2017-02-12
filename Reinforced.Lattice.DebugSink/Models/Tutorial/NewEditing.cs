using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Editing.Cells;
using Reinforced.Lattice.Editing.Editors.Check;
using Reinforced.Lattice.Editing.Editors.PlainText;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
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