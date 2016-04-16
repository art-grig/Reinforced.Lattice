using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Editors.Memo
{
    public class MemoEditorUiConfig : CellEditorUiConfigBase
    {
        public override string PluginId
        {
            get { return "MemoEditor"; }
        }

        public int WarningChars { get; set; }

        public int MaxChars { get; set; }

        public int Rows { get; set; }

        public int Columns { get; set; }

        public bool AllowEmptyString { get; set; }

        public MemoEditorUiConfig()
        {
            TemplateId = "memoEditor";
        }
    }
}
