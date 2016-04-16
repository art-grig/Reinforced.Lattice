using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Editors.PlainText;

namespace PowerTables.Editors.Memo
{
    public static class MemoEditorConfigurationExtensions
    {
        public static ColumnUsage<TSourceData, TTableData, string> EditMemo<TSourceData, TTableData>(this ColumnUsage<TSourceData, TTableData, string> t, Action<EditorConfigurationWrapper<MemoEditorUiConfig>> config = null) where TTableData : new()
        {
            t.TableConfigurator.TableConfiguration.UpdatePluginConfig<EditorUiConfig>(EditorExtensions.PluginId, c =>
            {
                var conf =
                    c.Configuration.GetOrReplaceEditorConfig<MemoEditorUiConfig>(
                        t.ColumnConfiguration.RawColumnName);

                var wrapper = new EditorConfigurationWrapper<MemoEditorUiConfig>(conf);
                if (config != null) config(wrapper);
            });

            return t;
        }

        public static EditorConfigurationWrapper<MemoEditorUiConfig> MaxChars(
            this EditorConfigurationWrapper<MemoEditorUiConfig> t, int charsWarning = 0, int charsError = 0)
        {
            t.EditorConfig.MaxChars = charsError;
            t.EditorConfig.WarningChars = charsWarning;
            return t;
        }

        public static EditorConfigurationWrapper<MemoEditorUiConfig> Size(
            this EditorConfigurationWrapper<MemoEditorUiConfig> t, int rows = 0, int cols = 0)
        {
            t.EditorConfig.Rows = rows;
            t.EditorConfig.Columns = cols;
            return t;
        }

        public static EditorConfigurationWrapper<MemoEditorUiConfig> AllowEmptyString(
            this EditorConfigurationWrapper<MemoEditorUiConfig> t, bool allow=true)
        {
            t.EditorConfig.AllowEmptyString = allow;
            return t;
        }
    }
}
