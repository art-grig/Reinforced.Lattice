using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace PowerTables.Editors
{
    /// <summary>
    /// Client plugin configuration for editor plugin
    /// </summary>
    public class EditorUiConfig
    {
        /// <summary>
        /// Event that should trigger editing event. DOMEvent class can be used here
        /// </summary>
        public string BeginEditEventId { get; set; }

        /// <summary>
        /// DOM event on corresponding element that should trigger committing of edition
        /// </summary>
        public string CommitEventId { get; set; }

        /// <summary>
        /// DOM event on corresponding element that should trigger rejecting of edition
        /// </summary>
        public string RejectEventId { get; set; }

        /// <summary>
        /// Internal collection of editor's configuration for each column. Key = column ID, Value = per-column configuration object
        /// </summary>
        public Dictionary<string, CellEditorUiConfigBase> EditorsForColumns { get; private set; }

        /// <summary>
        /// Functon that will be called before saving data to server to check integrity of saving object against 
        /// client loaded data
        /// </summary>
        public JRaw IntegrityCheckFunction { get; set; }

        public EditorUiConfig()
        {
            EditorsForColumns = new Dictionary<string, CellEditorUiConfigBase>();
            BeginEditEventId = "click";
            CommitEventId = "click";
            RejectEventId = "click";
            DeferChanges = true;
        }

        public bool DeferChanges { get; set; }

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

    public enum EditorType
    {
        Cell,
        Row,
        Form
    }
}
