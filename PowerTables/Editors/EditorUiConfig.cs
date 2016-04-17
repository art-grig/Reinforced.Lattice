using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace PowerTables.Editors
{
    public class EditorUiConfig
    {
        public string BeginEditEventId { get; set; }
        public string CommitEventId { get; set; }
        public string RejectEventId { get; set; }

        public Dictionary<string, CellEditorUiConfigBase> EditorsForColumns { get; private set; }

        public JRaw IntegrityCheckFunction { get; set; }

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

        public EditorType EditorType { get; set; }

    }

    public static class EditorUiConfigExtensions
    {
        internal static T GetOrReplaceEditorConfig<T>(this EditorUiConfig t, string columnName)
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

    public enum EditorType
    {
        Cell,
        Row,
        Form
    }
}
