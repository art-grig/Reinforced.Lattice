using System.Collections.Generic;

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
            RefreshMode = EditorRefreshMode.RedrawCell;
        }

        public EditorRefreshMode RefreshMode { get; set; }

        public bool IsServerPowered { get; set; }
    }

    public enum EditorRefreshMode
    {
        RedrawCell,
        RedrawRow,
        RedrawAllVisible,
        ReloadFromServer
    }
}
