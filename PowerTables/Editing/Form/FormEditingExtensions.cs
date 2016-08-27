using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Editing.Form
{
    public static class FormEditingExtensions
    {
        public static void EditingForm<TSource, TTarget>(
           this Configurator<TSource, TTarget> conf,
           Action<EditHandlerConfiguration<TTarget, FormEditUiConfig>> celsEditorConfig)
           where TTarget : new()
        {

        }
    }
}
