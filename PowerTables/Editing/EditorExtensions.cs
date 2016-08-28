﻿using System;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Plugins;

namespace PowerTables.Editing
{
    public static class EditorExtensions
    {
        public const string EditCommand = "Edit";
        public const string EditAdditionalDataKey = "Edit";

        public const string PluginId = "Editor";
        
        public static Template FormEditTrigger(this Template t)
        {
            return t.Data("editform", "true");
        }
    }
}