using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Checkboxify
{
    /// <summary>
    /// Extensions for checkboxify plugin
    /// </summary>
    public static class CheckboxifyExtensions
    {
        public const string PluginId = "Checkboxify";

        /// <summary>
        /// Appends select checkboxes at the left of the table making them handle selection
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conf">Table</param>
        /// <returns>Fluent</returns>
        public static T Checkboxify<T>(this T conf) where T : IConfigurator
        {
            if (conf.HasColumn("_checkboxify")) return conf;

            var cc = conf.AddUiColumn<string>("_checkboxify", " ", -1);
            cc.TemplateId("checkboxifyCell");
            cc.SubscribeCellEvent(c => c.Selector("[data-checkboxify]").Handle("click", "function(c) { c.Master.Selection.toggleObjectSelected(c.Master.DataHolder.localLookupDisplayedData(c.DisplayingRowIndex).DataObject); }"));

            return conf;
        }

        /// <summary>
        /// Response will set selection on client-side to specified range of values
        /// </summary>
        /// <param name="a">Additional data</param>
        /// <param name="keysToSelect">Keys to be selectd</param>
        public static void SetSelection(this IAdditionalDataProvider a, IEnumerable<string> keysToSelect)
        {
            //a.AdditionalData["Selection"] = new SelectionAdditionalData()
            //{
            //    ReplaceSelection = true,
            //    SelectionToReplace = keysToSelect.ToArray()
            //};
        }

        /// <summary>
        /// Modify selection range on client-side
        /// </summary>
        /// <param name="a">Additional data</param>
        /// <param name="addToSelection">Keys to be added to selection</param>
        /// <param name="removeFromSelection">Keys to be removed from selection</param>
        public static void ModifySelection(this IAdditionalDataProvider a, IEnumerable<string> addToSelection = null, IEnumerable<string> removeFromSelection = null)
        {
            //a.AdditionalData["Selection"] = new SelectionAdditionalData()
            //{
            //    ModifySelection = true,
            //    AddToSelection = addToSelection==null?null:addToSelection.ToArray(),
            //    RemoveFromSelection = removeFromSelection == null ? null : removeFromSelection.ToArray()
            //};
        }
    }

    /// <summary>
    /// Describes how "Select all" checkbox should act
    /// </summary>
    public enum SelectAllBehavior
    {
        /// <summary>
        /// Disabled "Select all" checkbox
        /// </summary>
        Disabled,

        /// <summary>
        /// "Select all" will be avaiable only if all data is visible on page
        /// </summary>
        OnlyIfAllDataVisible,

        /// <summary>
        /// "Select all" will select/deselect only current data page
        /// </summary>
        CurrentPage,

        /// <summary>
        /// "Select all" will query server to retrieve all data to select
        /// </summary>
        InvolveServer,

        /// <summary>
        /// "Select all" select all available local data
        /// </summary>
        AllLocal
    }
}
