using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Editors.Check
{
    /// <summary>
    /// JSON configuration for Checkbox editor
    /// </summary>
    public class CheckEditorUiConfig : CellEditorUiConfigBase
    {
        /// <summary>
        /// Plugin ID
        /// </summary>
        public override string PluginId
        {
            get { return "CheckEditor"; }
        }

        /// <summary>
        /// Is checkbox mandatory to be checked
        /// </summary>
        public bool IsMandatory { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public CheckEditorUiConfig()
        {
            TemplateId = "checkEditor";
        }
    }
}
