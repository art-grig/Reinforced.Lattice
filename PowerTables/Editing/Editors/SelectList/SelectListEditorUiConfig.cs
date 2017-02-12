using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace PowerTables.Editing.Editors.SelectList
{
    public class SelectListEditorUiConfig : EditFieldUiConfigBase
    {
        public override string PluginId
        {
            get { return "SelectListEditor"; }
        }

        public List<UiListItem> SelectListItems { get; set; }

        public bool AllowEmptyString { get; set; }

        public string EmptyElementText { get; set; }

        public bool AddEmptyElement { get; set; }

        public JRaw MissingKeyFunction { get; set; }
        public JRaw MissingValueFunction { get; set; }

        public SelectListEditorUiConfig()
        {
            SelectListItems = new List<UiListItem>();
            TemplateId = "selectListEditor";
        }
    }
}
