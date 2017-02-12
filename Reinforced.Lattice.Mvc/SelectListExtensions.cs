using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables;
using PowerTables.Editing;
using PowerTables.Editing.Editors.SelectList;
using PowerTables.Filters.Select;
using PowerTables.Plugins;

namespace Reinforced.Lattice.Mvc
{
    public static class SelectListExtensions
    {
        public static IEnumerable<UiListItem> ToUi(this IEnumerable<SelectListItem> ui)
        {
            foreach (var sli in ui)
            {
                yield return sli.ToUi();
            }
        }

        public static UiListItem ToUi(this SelectListItem sli)
        {
            return new UiListItem() { Selected = sli.Selected, Disabled = sli.Disabled, Text = sli.Text, Value = sli.Value };
        }

        /// <summary>
        /// Sets select items for filter UI
        /// </summary>
        /// <param name="config">Configuration</param>
        /// <param name="items">Select list with available values</param>
        /// <param name="replaceItems">When true, currently presented items will be replaced with newly supplied ones</param>
        /// <returns></returns>
        public static ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> SelectItems<TColumn>(this ColumnPluginConfigurationWrapper<SelectFilterUiConfig, TColumn> config,
            IEnumerable<SelectListItem> items, bool replaceItems = false)
        {
            return config.SelectItems(items.ToUi(), replaceItems);
        }

        public static IEditFieldUsage<SelectListEditorUiConfig> Items(
            this IEditFieldUsage<SelectListEditorUiConfig> t, IEnumerable<SelectListItem> selectItems)
        {
            t.UiConfig.SelectListItems = selectItems.ToUi().ToList();
            return t;
        }

        public static IEditFieldUsage<SelectListEditorUiConfig> AddItem(
            this IEditFieldUsage<SelectListEditorUiConfig> t, SelectListItem item)
        {
            t.UiConfig.SelectListItems.Add(item.ToUi());
            return t;
        }
    }
}
