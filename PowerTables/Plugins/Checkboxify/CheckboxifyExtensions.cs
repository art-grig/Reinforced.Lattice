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
        /// From request retrieves data selected by Checkboxify
        /// </summary>
        /// <typeparam name="T">Type of selection data (type of originally configured column)</typeparam>
        /// <param name="req">Request</param>
        /// <returns>Set of selection</returns>
        public static T[] GetSelectionIds<T>(this PowerTableRequest req)
        {
            if (!req.Query.AdditionalData.ContainsKey("Selection")) return new T[0];
            var s = req.Query.AdditionalData["Selection"];
            var result = s.Split('|').Select(ValueConverter.Convert<T>).ToArray();
            return result;
        }

        /// <summary>
        /// From request retrieves data selected by Checkboxify
        /// </summary>
        /// <typeparam name="T">Type of selection data (type of originally configured column)</typeparam>
        /// <param name="req">Request</param>
        /// <param name="configurator">Table configurator</param>
        /// <returns>Set of selection</returns>
        public static T[] GetSelectionIds<T>(this Query req, IConfigurator configurator)
        {
            if (!req.AdditionalData.ContainsKey("Selection")) return new T[0];
            var s = req.AdditionalData["Selection"];
            var result = s.Split('|').Select(ValueConverter.Convert<T>).ToArray();
            return result;
        }

        /// <summary>
        /// Places select checkboxes within every row
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <typeparam name="TTableColumn"></typeparam>
        /// <param name="conf">Table configuration</param>
        /// <param name="column">Column that will be used as ID provider for select checkbox</param>
        /// <param name="selectAllBehavior">Behavior for "Select All" button</param>
        /// <param name="ui">UI configuration</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> Checkboxify<TSourceData, TTableData, TTableColumn>(
            this Configurator<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            SelectAllBehavior selectAllBehavior = SelectAllBehavior.OnlyIfAllDataVisible,
            Action<PluginConfigurationWrapper<CheckboxifyClientConfig>> ui = null
            ) where TTableData : new()
        {
            var targetProp = LambdaHelpers.ParsePropertyLambda(column);
            var colName = targetProp.Name;
            CheckboxifyClientConfig ccc = new CheckboxifyClientConfig
            {
                SelectionColumnName = colName
            };
            switch (selectAllBehavior)
            {
                case SelectAllBehavior.Disabled:
                    ccc.EnableSelectAll = false;
                    break;
                case SelectAllBehavior.CurrentPage:
                    //ccc.ResetOnReload = true;
                    ccc.EnableSelectAll = true;
                    break;
                case SelectAllBehavior.OnlyIfAllDataVisible:
                    ccc.EnableSelectAll = true;
                    ccc.SelectAllOnlyIfAllData = true;
                    break;
                case SelectAllBehavior.AllLocal:
                    ccc.EnableSelectAll = true;
                    ccc.SelectAllSelectsClientUndisplayedData = true;
                    break;
                case SelectAllBehavior.InvolveServer:
                    try
                    {
                        var p = typeof(TSourceData).GetProperty(colName);
                        if (p.PropertyType != targetProp.PropertyType) throw new Exception();
                    }
                    catch (Exception ex)
                    {
                        throw new Exception(
                            String.Format(
                            "In case of using SelectAllBehavior.InvolveServer, please assure that property {0} exists on both {1} and {2} types and represents same data",
                            colName, typeof(TSourceData).FullName, typeof(TTableData).FullName));
                    }
                    ccc.EnableSelectAll = true;
                    ccc.SelectAllSelectsServerUndisplayedData = true;
                    conf.RegisterCommandHandler<CheckboxifyCommandHandler>("checkboxify_all");

                    break;
            }
            conf.TableConfiguration.ReplacePluginConfig(PluginId, ccc);
            conf.TableConfiguration.UpdatePluginConfig(PluginId, ui);
            return conf;
        }

        /// <summary>
        /// Specifies templates for checkboxify
        /// </summary>
        /// <param name="c"></param>
        /// <param name="selectAllTemplateId">Template for Select All button</param>
        /// <param name="rowTemplateId">Template for selected row</param>
        /// <param name="cellTemplateId">Template for cell containing checkboxify checkbox</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<CheckboxifyClientConfig> Templates(
            this PluginConfigurationWrapper<CheckboxifyClientConfig> c,
            string selectAllTemplateId = "checkboxifySelectAll",
            string rowTemplateId = "checkboxifyRow",
            string cellTemplateId = "checkboxifyCell")
        {
            c.Configuration.SelectAllTemplateId = selectAllTemplateId;
            c.Configuration.RowTemplateId = rowTemplateId;
            c.Configuration.CellTemplateId = cellTemplateId;
            return c;
        }

        /// <summary>
        /// Regulates selection reseting behavior
        /// </summary>
        /// <param name="c"></param>
        /// <param name="resetOnClientLoad">Reset selection on client-side reload of visible data</param>
        /// <param name="resetOnLoad">Reset selection after loading actual data on server</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<CheckboxifyClientConfig> ResetBehavior(
            this PluginConfigurationWrapper<CheckboxifyClientConfig> c, bool resetOnLoad = false, bool resetOnClientLoad = false)
        {
            c.Configuration.ResetOnReload = resetOnLoad;
            c.Configuration.ResetOnClientReload = resetOnClientLoad;
            return c;
        }

        /// <summary>
        /// Specifies predicate function for selectable row. 
        /// function type: (v:any)=>boolean
        /// </summary>
        /// <param name="c"></param>
        /// <param name="function">Function that consumes IRow object and should return true for selectable row and false for unselectable</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<CheckboxifyClientConfig> CanSelectFunction(this PluginConfigurationWrapper<CheckboxifyClientConfig> c, string function)
        {
            c.Configuration.CanSelectFunction = string.IsNullOrEmpty(function) ? null : new JRaw(function);
            return c;
        }

        /// <summary>
        /// Specifies predicate function for selectable row. 
        /// function type: (v:any)=>boolean
        /// </summary>
        /// <param name="c"></param>
        /// <param name="function">Function that consumes IRow object and should return true for selectable row and false for unselectable</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<CheckboxifyClientConfig> CanSelectExpression(this PluginConfigurationWrapper<CheckboxifyClientConfig> c, string expression)
        {
            var function = string.Format("function(v) {{ return ({0});}}", Template.CompileExpression(expression, "v", "DataObject",null));
            c.Configuration.CanSelectFunction = new JRaw(function);
            return c;
        }

        /// <summary>
        /// Response will set selection on client-side to specified range of values
        /// </summary>
        /// <param name="a">Additional data</param>
        /// <param name="keysToSelect">Keys to be selectd</param>
        public static void SetSelection(this IAdditionalDataProvider a, IEnumerable<string> keysToSelect)
        {
            a.AdditionalData["Selection"] = new SelectionAdditionalData()
            {
                ReplaceSelection = true,
                SelectionToReplace = keysToSelect.ToArray()
            };
        }

        /// <summary>
        /// Modify selection range on client-side
        /// </summary>
        /// <param name="a">Additional data</param>
        /// <param name="addToSelection">Keys to be added to selection</param>
        /// <param name="removeFromSelection">Keys to be removed from selection</param>
        public static void ModifySelection(this IAdditionalDataProvider a, IEnumerable<string> addToSelection = null,IEnumerable<string> removeFromSelection = null )
        {
            a.AdditionalData["Selection"] = new SelectionAdditionalData()
            {
                ModifySelection = true,
                AddToSelection = addToSelection==null?null:addToSelection.ToArray(),
                RemoveFromSelection = removeFromSelection == null ? null : removeFromSelection.ToArray()
            };
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
