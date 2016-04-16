using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Editors.Check
{
    public class CheckEditorUiConfig : CellEditorUiConfigBase
    {
        public override string PluginId
        {
            get { return "CheckEditor"; }
        }

        public bool IsMandatory { get; set; }

        public CheckEditorUiConfig()
        {
            TemplateId = "checkEditor";
        }
    }
}
