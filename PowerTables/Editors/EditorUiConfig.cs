using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Editors
{
    public class EditorUiConfig
    {
        public string BeginEditEventId { get; set; }

        public string CommitEventId { get; set; }
        public string RejectEventId { get; set; }

        public Dictionary<string, CellEditorUiConfigBase> EditorsForColumns { get; private set; }

        public EditorUiConfig()
        {
            EditorsForColumns = new Dictionary<string, CellEditorUiConfigBase>();
            BeginEditEventId = "click";
            CommitEventId = "click";
            RejectEventId = "click";
        }
    }
}
