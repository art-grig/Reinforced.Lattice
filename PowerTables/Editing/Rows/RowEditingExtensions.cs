using System;
using PowerTables.Configuration;

namespace PowerTables.Editing.Rows
{
    public static class RowsEditingExtensions
    {
        public static void EditingRow<TSource, TTarget>(
            this Configurator<TSource, TTarget> conf,
            Action<EditHandlerConfiguration<TTarget, RowsEditUiConfig>> celsEditorConfig)
            where TTarget : new()
        {

        }

    }
}
