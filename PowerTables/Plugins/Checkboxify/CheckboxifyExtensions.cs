using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
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
            var result = s.Split('|').Select(c=>ValueConverter.Convert<T>(c,req.Configurator)).ToArray();
            return result;
        }

        /// <summary>
        /// From request retrieves data selected by Checkboxify
        /// </summary>
        /// <typeparam name="T">Type of selection data (type of originally configured column)</typeparam>
        /// <param name="req">Request</param>
        /// <param name="configurator">Table configurator</param>
        /// <returns>Set of selection</returns>
        public static T[] GetSelectionIds<T>(this Query req,IConfigurator configurator)
        {
            if (!req.AdditionalData.ContainsKey("Selection")) return new T[0];
            var s = req.AdditionalData["Selection"];
            var result = s.Split('|').Select(c => ValueConverter.Convert<T>(c, configurator)).ToArray();
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
        /// <param name="selectAllBehavior">Specifies select all checkbox behavior</param>
        /// <param name="resetOnLoad">Reset selection on table reload or not</param>
        /// <param name="selectedClass">Class name that will be assigned to selected row</param>
        /// <param name="columnTitle">Selection column title</param>
        /// <param name="selectAllLocation">Location of "select all" checkbox - on header or with filters</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> Checkboxify<TSourceData, TTableData, TTableColumn>(
            this Configurator<TSourceData, TTableData> conf,
            Expression<Func<TTableData, TTableColumn>> column,
            SelectAllBehavior selectAllBehavior = SelectAllBehavior.OnlyIfAllDataVisible,
            bool resetOnLoad = false,
            string selectedClass = null,
            string columnTitle = null,
            SelectAllLocation selectAllLocation = SelectAllLocation.FiltersHeader

            ) where TTableData : new()
        {
            var targetProp = LambdaHelpers.ParsePropertyLambda(column);
            var colName = targetProp.Name;
            CheckboxifyClientConfig ccc = new CheckboxifyClientConfig
            {
                SelectionColumnName = colName,
                ResetOnReload = resetOnLoad,
                SelectedRowClass = selectedClass,
                CheckboxifyColumnName = columnTitle
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
                    ccc.SelectAllSelectsUndisplayedData = true;
                    conf.RegisterCommandHandler<CheckboxifyCommandHandler>("checkboxify_all");

                    break;
            }
            ccc.SelectAllLocation = selectAllLocation;
            conf.TableConfiguration.ReplacePluginConfig(PluginId, ccc);
            return conf;
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
        InvolveServer
    }
}
