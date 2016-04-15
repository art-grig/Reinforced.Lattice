using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.FrequentlyUsed;

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

        public static Template CellEditTrigger(this Template t)
        {
            return t.Data("editcell", "true");
        }

        public static Template RowEditTrigger(this Template t)
        {
            return t.Data("editrow", "true");
        }

        public static Template RowCommitTrigger(this Template t)
        {
            return t.Data("editrow", "true");
        }

        public static Template RowRejectTrigger(this Template t)
        {
            return t.Data("editrow", "true");
        }

        public static Template FormEditTrigger(this Template t)
        {
            return t.Data("editform", "true");
        }
    }
}
