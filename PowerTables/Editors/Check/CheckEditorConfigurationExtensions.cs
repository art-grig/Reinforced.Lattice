using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Editors.Memo;

namespace PowerTables.Editors.Check
{
    public static class CheckEditorConfigurationExtensions
    {
        private static void DoCheckConfiguration(TableConfiguration tconf,
            Action<EditorConfigurationWrapper<CheckEditorUiConfig>> config,string colName)
        {
            tconf.UpdatePluginConfig<EditorUiConfig>(EditorExtensions.PluginId, c =>
            {
                var conf =
                    c.Configuration.GetOrReplaceEditorConfig<CheckEditorUiConfig>(colName);
                var wrapper = new EditorConfigurationWrapper<CheckEditorUiConfig>(conf);
                if (config != null) config(wrapper);
            });
        }

        public static ColumnUsage<TSourceData, TTableData, bool> EditCheck<TSourceData, TTableData>(this ColumnUsage<TSourceData, TTableData, bool> t, Action<EditorConfigurationWrapper<CheckEditorUiConfig>> config = null) where TTableData : new()
        {
            DoCheckConfiguration(t.TableConfigurator.TableConfiguration,config,t.ColumnConfiguration.RawColumnName);
            return t;
        }

        public static ColumnUsage<TSourceData, TTableData, bool?> EditCheck<TSourceData, TTableData>(this ColumnUsage<TSourceData, TTableData, bool?> t, Action<EditorConfigurationWrapper<CheckEditorUiConfig>> config = null) where TTableData : new()
        {
            DoCheckConfiguration(t.TableConfigurator.TableConfiguration, config, t.ColumnConfiguration.RawColumnName);
            return t;
        }

        public static EditorConfigurationWrapper<CheckEditorUiConfig> Mandatory(
            this EditorConfigurationWrapper<CheckEditorUiConfig> t, bool mandatory = true)
        {
            t.EditorConfig.IsMandatory = true;
            return t;
        }
    }
}
