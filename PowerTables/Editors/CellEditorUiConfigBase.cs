using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace PowerTables.Editors
{
    public abstract class CellEditorUiConfigBase
    {
        public abstract string PluginId { get; }

        /// <summary>
        /// Provides custom validation function for this particular row
        /// </summary>
        public JRaw CustomValidationFunction { get; set; }
    }
}
