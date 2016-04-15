using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerTables.Editors.SelectList
{
    public class SelectListEditorUiConfig : CellEditorUiConfigBase
    {
        public override string PluginId
        {
            get { return "SelectListEditor"; }
        }

        public List<SelectListItem> SelectListItems { get; set; }

        public bool AllowEmptyString { get; set; }

        public string EmptyElementText { get; set; }

        public bool AddEmptyElement { get; set; }

        public SelectListEditorUiConfig()
        {
            SelectListItems = new List<SelectListItem>();
            TemplateId = "selectListEditor";
        }
    }
}
