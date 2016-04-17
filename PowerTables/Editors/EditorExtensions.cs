using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins;

namespace PowerTables.Editors
{
    public static class EditorExtensions
    {
        public const string EditCommand = "Edit";
        public const string EditAdditionalDataKey = "Edit";

        public const string PluginId = "Editor";

        public static EditorConfig EditOnEvents(this EditorConfig conf, string beginEdit = "click")
        {
            conf.Config.BeginEditEventId = beginEdit;
            return conf;
        }

        public static EditorConfig DoNotSendResultsToServer(this EditorConfig conf, bool doNotSed = true)
        {
            conf.Config.DeferChanges = !doNotSed;
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

        public static EditorConfigurationWrapper<T> TemplateId<T>(this EditorConfigurationWrapper<T> conf,
            string templateId)
            where T : CellEditorUiConfigBase, new()
        {
            conf.EditorConfig.TemplateId = templateId;
            return conf;
        }

        public static EditorConfigurationWrapper<T> ValidationMessagesTemplateId<T>(this EditorConfigurationWrapper<T> conf,
            string templateId)
            where T : CellEditorUiConfigBase, new()
        {
            conf.EditorConfig.ValidationMessagesTemplateId = templateId;
            return conf;
        }

        public static Configurator<TSource, TTarget> Edit<TSource, TTarget>(this Configurator<TSource, TTarget> conf, Action<PluginConfigurationWrapper<EditorConfig>> ui) where TTarget : new()
        {
            return null;
        }
    }
}
