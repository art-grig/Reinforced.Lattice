using System;
using System.Linq;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.Hideout
{
    /// <summary>
    /// Extensions for Hideout plugin. 
    /// Hideout plugin is used to show/hide columns in resulting table. 
    /// Also this plugin optionally could output menu for dynamic showing and hiding 
    /// columns.
    /// </summary>
    public static class HideoutExtensions
    {
        public const string PluginId = "Hideout";

        /// <summary>
        /// Hides specified column on client-side. 
        /// Hidden column will not be displayed but will be rendered to DOM to be able hidden/shown by target user
        /// </summary>
        /// <param name="column">Column</param>
        /// <param name="hide">Should current column be hidden or not</param>
        /// <param name="initiatesReload">Initiate table reload when this column is being hidden</param>
        /// <param name="where">Plugin placement - to distinguish which instance to update. Can be omitted if you have single plugin instance per table.</param>
        /// <returns>Fluent</returns>
        public static ColumnUsage<TSourceData, TTableData, TTableColumn>
            Hide
            <TSourceData, TTableData, TTableColumn>(
            this ColumnUsage<TSourceData, TTableData, TTableColumn> column,
            bool hide = true,
            bool initiatesReload = false,
            string where = null) where TTableData : new()
        {
            column.Configurator.TableConfiguration.UpdatePluginConfig<HideoutPluginConfiguration>(PluginId, c =>
            {
                if (hide) c.Configuration.HiddenColumns[column.ColumnProperty.Name] = true;
                if (initiatesReload) c.Configuration.ColumnInitiatingReload.Add(column.ColumnProperty.Name);
            },where);
            return column;
        }

        /// <summary>
        /// Makes table to show/hide columns. 
        /// Also this method adds menu with ability to hide/show columns as an option. 
        /// Warning! This method should be called before using .Hide. Otherwise .Hide wont 
        /// take effect.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="columns">Hideable columns to show in hideout menu</param>
        /// <param name="where">Plugin placement - to distinguish which instance to update. Can be omitted if you have single plugin instance per table.</param>
        /// <param name="ui">UI settings for Hideout plugin</param>
        /// <returns>Fluent</returns>
        public static Configurator<TSourceData, TTableData>
            HideoutMenu
            <TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf,
            Action<ColumnListBuilder<TSourceData, TTableData>> columns,
            Action<PluginConfigurationWrapper<HideoutPluginConfiguration>> ui = null,
            string where = null
            ) where TTableData : new()
        {
            ColumnListBuilder<TSourceData, TTableData> bldr = new ColumnListBuilder<TSourceData, TTableData>(conf);
            columns(bldr);
            conf.TableConfiguration.UpdatePluginConfig<HideoutPluginConfiguration>(PluginId, a =>
            {
                if (ui != null) ui(a);
                a.Configuration.HideableColumnsNames = bldr.Names.ToList();
            }, where);

            return conf;

        }

        private const string HideoutHiddenAdditionalDataKey = "HideoutHidden";
        private const string HideoutShownAdditionalDataKey = "HideoutShown";

        #region Hidden columns in request
        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are hidden</returns>
        public static PropertyDescription[] GetHiddenColumns(this LatticeRequest request, IConfigurator conf)
        {
            return GetHiddenColumns(request.Query, conf);
        }

        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of hidden columns</returns>
        public static string[] GetHiddenColumns(this LatticeRequest request)
        {
            return GetHiddenColumns(request.Query);
        }

        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are hidden</returns>
        public static PropertyDescription[] GetHiddenColumns(this Query request, IConfigurator conf)
        {
            var columns = GetHiddenColumns(request);
            return conf.TableColumnsDictionary.Where(c => columns.Contains(c.Key)).Select(c => c.Value).ToArray();
        }

        /// <summary>
        /// Returns all columns that are being hidden on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of hidden columns</returns>
        public static string[] GetHiddenColumns(this Query request)
        {
            return GetColumns(request, HideoutHiddenAdditionalDataKey);
        }
        #endregion

        #region Shown columns in request
        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are shown</returns>
        public static PropertyDescription[] GetShownColumns(this LatticeRequest request, IConfigurator conf)
        {
            return GetShownColumns(request.Query, conf);
        }

        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of shown columns</returns>
        public static string[] GetShownColumns(this LatticeRequest request)
        {
            return GetShownColumns(request.Query);
        }

        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <param name="conf">Table configurator</param>
        /// <returns>Array of PropertyInfos that are shown</returns>
        public static PropertyDescription[] GetShownColumns(this Query request, IConfigurator conf)
        {
            var columns = GetHiddenColumns(request);
            return conf.TableColumnsDictionary.Where(c => columns.Contains(c.Key)).Select(c => c.Value).ToArray();
        }

        /// <summary>
        /// Returns all columns that are being shown on client-side
        /// </summary>
        /// <param name="request">Request</param>
        /// <returns>Array of strings denoting names of shown columns</returns>
        public static string[] GetShownColumns(this Query request)
        {
            return GetColumns(request, HideoutShownAdditionalDataKey);
        }
        #endregion

        private static string[] GetColumns(Query request, string key)
        {
            if (!request.AdditionalData.ContainsKey(key)) return new string[0];
            var cols = request.AdditionalData[key];
            return cols.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
        }

        public static PluginConfigurationWrapper<HideoutPluginConfiguration> ShowMenu(
            this PluginConfigurationWrapper<HideoutPluginConfiguration> t, bool show = true)
        {
            t.Configuration.ShowMenu = show;
            return t;
        }
    }
}
