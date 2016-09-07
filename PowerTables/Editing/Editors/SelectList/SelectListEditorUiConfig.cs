﻿using System.Collections.Generic;
using System.Web.Mvc;
using Newtonsoft.Json.Linq;

namespace PowerTables.Editing.Editors.SelectList
{
    public class SelectListEditorUiConfig : EditFieldUiConfigBase
    {
        public override string PluginId
        {
            get { return "SelectListEditor"; }
        }

        public List<SelectListItem> SelectListItems { get; set; }

        public bool AllowEmptyString { get; set; }

        public string EmptyElementText { get; set; }

        public bool AddEmptyElement { get; set; }

        public JRaw MissingKeyFunction { get; set; }
        public JRaw MissingValueFunction { get; set; }

        public SelectListEditorUiConfig()
        {
            SelectListItems = new List<SelectListItem>();
            TemplateId = "selectListEditor";
        }
    }
}
