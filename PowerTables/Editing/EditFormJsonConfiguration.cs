using System.Collections.Generic;

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

        protected EditFieldUiConfigBase()
        {
            ValidationMessagesTemplateId = "cellValidationMessages";
        }
    }
}
