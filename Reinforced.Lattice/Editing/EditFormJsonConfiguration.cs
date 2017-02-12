using System.Collections.Generic;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Editing
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

        public Dictionary<string,string> ValidationMessagesOverride { get; private set; }

        protected EditFieldUiConfigBase()
        {
            ValidationMessagesTemplateId = "cellValidationMessages";
            ValidationMessagesOverride = new Dictionary<string, string>();
        }
    }
}
