using System.Collections.Generic;
using PowerTables.Configuration.Json;

namespace PowerTables.Editing
{
    public abstract class EditFormUiConfigBase
    {
        public List<EditFieldUiConfigBase> Fields { get; set; }

        protected EditFormUiConfigBase()
        {
            Fields = new List<EditFieldUiConfigBase>();
        }
    }

    public abstract class EditFieldUiConfigBase
    {
        public string TemplateId { get; set; }

        public string FieldName { get; set; }

        public abstract string PluginId { get; }

        public string ValidationMessagesTemplateId { get; set; }

        public ColumnConfiguration FakeColumn { get; set; }

        protected EditFieldUiConfigBase()
        {
            ValidationMessagesTemplateId = "cellValidationMessages";
        }
    }
}
