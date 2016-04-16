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

        public string TemplateId { get; set; }

        public string ValidationMessagesTemplateId { get; set; }
    }

    public class EditorConfigurationWrapper<T>
        where T:CellEditorUiConfigBase,new()
    {
        internal T EditorConfig { get; private set; }

        public EditorConfigurationWrapper(T editorConfig)
        {
            EditorConfig = editorConfig;
        }

        public EditorConfigurationWrapper()
        {
            EditorConfig = new T(){ValidationMessagesTemplateId = "cellValidationMessages"};
        } 
    }
}
