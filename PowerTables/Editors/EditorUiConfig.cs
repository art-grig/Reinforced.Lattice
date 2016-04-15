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
            IsServerPowered = true;
        }

        public EditorRefreshMode RefreshMode { get; set; }

        public bool IsServerPowered { get; set; }
    }

    public static class EditorUiConfigExtensions
    {
        public static T GetOrReplaceEditorConfig<T>(this EditorUiConfig t, string columnName)
            where T : CellEditorUiConfigBase,new()
        {
            if (t.EditorsForColumns.ContainsKey(columnName))
            {
                var conf = t.EditorsForColumns[columnName];
                if (typeof (T) == conf.GetType())
                {
                    return (T) conf;
                }
            }

            var newConf = new T();
            t.EditorsForColumns[columnName] = newConf;
            return newConf;
        }
    }

    public enum EditorRefreshMode
    {
        RedrawCell,
        RedrawRow,
        RedrawAllVisible,
        ReloadFromServer
    }
}
