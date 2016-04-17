using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Editors.PlainText;

namespace PowerTables.Editors.SelectList
{
    public static class SelectListEditorConfigurationExtensions
    {
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> EditSelectList<TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> t, 
            Action<EditorConfigurationWrapper<SelectListEditorUiConfig>> config = null) where TTableData : new()
        {
            t.TableConfigurator.TableConfiguration.UpdatePluginConfig<EditorUiConfig>(EditorExtensions.PluginId, c =>
            {
                var conf =
                    c.Configuration.GetOrReplaceEditorConfig<SelectListEditorUiConfig>(
                        t.ColumnConfiguration.RawColumnName);
                
                var wrapper = new EditorConfigurationWrapper<SelectListEditorUiConfig>(conf);
                if (config != null) config(wrapper);
            });

            return t;
        }

        public static EditorConfigurationWrapper<SelectListEditorUiConfig> CanSelectEmpty(
            this EditorConfigurationWrapper<SelectListEditorUiConfig> t, bool allow = true)
        {
            t.EditorConfig.AllowEmptyString = allow;
            return t;
        }

        public static EditorConfigurationWrapper<SelectListEditorUiConfig> WithEmptyElement(
            this EditorConfigurationWrapper<SelectListEditorUiConfig> t, string elementText = "Empty",bool allowEmpty = true)
        {
            t.EditorConfig.AllowEmptyString = allowEmpty;
            t.EditorConfig.AddEmptyElement = true;
            t.EditorConfig.EmptyElementText = elementText;
            return t;
        }

        public static EditorConfigurationWrapper<SelectListEditorUiConfig> Items(
            this EditorConfigurationWrapper<SelectListEditorUiConfig> t, IEnumerable<SelectListItem> selectItems)
        {
            t.EditorConfig.SelectListItems = selectItems.ToList();
            return t;
        }

        public static EditorConfigurationWrapper<SelectListEditorUiConfig> AddItem(
            this EditorConfigurationWrapper<SelectListEditorUiConfig> t, SelectListItem item)
        {
            t.EditorConfig.SelectListItems.Add(item);
            return t;
        }
        
    }
}
