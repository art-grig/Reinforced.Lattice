using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Editors
{
    public class EditorClientConfiguration
    {
        public Dictionary<string, CellEditorConfigurationBase> EditorsForColumns { get; private set; }

        public EditorClientConfiguration()
        {
            EditorsForColumns = new Dictionary<string, CellEditorConfigurationBase>();
        }
    }
}
