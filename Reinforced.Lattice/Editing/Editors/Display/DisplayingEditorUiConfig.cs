﻿using Newtonsoft.Json.Linq;

namespace Reinforced.Lattice.Editing.Editors.Display
{
    public class DisplayingEditorUiConfig : EditFieldUiConfigBase
    {
        public override string PluginId
        {
            get { return "DisplayEditor"; }
        }

        public JRaw Template { get; set; }

        public DisplayingEditorUiConfig()
        {
            TemplateId = "displayEditor";
        }
    }
}
