using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Editing.Cells
{
    public static class CellsEditingExtensions
    {
        public static void EditingCells<TSource, TTarget>(
           this Configurator<TSource, TTarget> conf,
           Action<EditHandlerConfiguration<TTarget, CellsEditUiConfig>> celsEditorConfig)
           where TTarget : new()
        {

        }
    }
}
