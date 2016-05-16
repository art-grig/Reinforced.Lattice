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
    /// <summary>
    /// Configuration extensions for checkbox editor
    /// </summary>
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

        /// <summary>
        /// Make all column cells editable with Checkbox editor. This method is only applicable for boolean columns
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="config">UI configuration builder for checkbox editor</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, bool> EditCheck<TSourceData, TTableData>(this ColumnUsage<TSourceData, TTableData, bool> t, Action<EditorConfigurationWrapper<CheckEditorUiConfig>> config = null) where TTableData : new()
        {
            DoCheckConfiguration(t.TableConfigurator.TableConfiguration,config,t.ColumnConfiguration.RawColumnName);
            return t;
        }

        /// <summary>
        /// Make all column cells editable with Checkbox editor. This method is only applicable for nullable-boolean columns
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="config">UI configuration builder for checkbox editor</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, bool?> EditCheck<TSourceData, TTableData>(this ColumnUsage<TSourceData, TTableData, bool?> t, Action<EditorConfigurationWrapper<CheckEditorUiConfig>> config = null) where TTableData : new()
        {
            DoCheckConfiguration(t.TableConfigurator.TableConfiguration, config, t.ColumnConfiguration.RawColumnName);
            return t;
        }


        /// <summary>
        /// Make checkbox mandatory to be checked. E.g. validation eroor will be thrown if checkbox for this column is unchecked
        /// </summary>
        /// <param name="t"></param>
        /// <param name="mandatory">Is checkbox mandatory or not</param>
        /// <returns></returns>
        public static EditorConfigurationWrapper<CheckEditorUiConfig> Mandatory(
            this EditorConfigurationWrapper<CheckEditorUiConfig> t, bool mandatory = true)
        {
            t.EditorConfig.IsMandatory = true;
            return t;
        }
    }
}
