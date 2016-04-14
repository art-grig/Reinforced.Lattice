using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Editors
{
    public static class EditorExtensions
    {
        public const string EditCommand = "Edit";

        public const string PluginId = "Editor";

        public static EditorConfig EditOnEvents(this EditorConfig conf, string beginEdit = "click")
        {
            conf.Config.BeginEditEventId = beginEdit;
            return conf;
        }

        public static EditorConfig DoNotSendResultsToServer(this EditorConfig conf, bool doNotSed = true)
        {
            conf.Config.IsServerPowered = !doNotSed;
            return conf;
        }

        public static EditorConfig Refresh(this EditorConfig conf, EditorRefreshMode mode)
        {
            conf.Config.RefreshMode = mode;
            return conf;
        }
    }
}
