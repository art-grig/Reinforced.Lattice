using System;
using System.Linq;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Limit
{
    /// <summary>
    /// Extensions for limit plugin
    /// </summary>
    public static class LimitPluginExtensions
    {
        public const string PluginId = "Limit";

        /// <summary>
        /// Attaches menu with possible results count per page to table (the "limit menu"). 
        /// This plugin is supposed to be used with paging plugin. 
        /// Few words about values: there should be numbers provided as string. 
        /// The numbers denote number of records to fetch from server. 
        /// The "-" string interpreted as menu separator. 
        /// Any other strings will produce menu item that will have this string as label and will 
        /// instruct table to retrieve all records.
        /// </summary>
        /// <param name="configurator">Table configurator.</param>
        /// <param name="values">Values for limit menu. By default is { "All", "10", "50", "100" }</param>
        /// <param name="defaultValue">Value from limit menu selected by default.</param>
        /// <param name="reloadTableOnLimitChange">
        /// When true then selecting new value from limit values menu will lead to table reloading. 
        /// In case of false you have to do that manually.
        /// </param>
        /// <param name="enableCientLimiting">When true, limiting requests will not be passed to server. Client will load unlimited data and limit it manually on client-side</param>
        /// <param name="position">Visual limit menu position</param>
        /// <returns></returns>
        public static T Limit<T>(this T configurator, string[] values, string defaultValue = null, bool reloadTableOnLimitChange = true, bool enableCientLimiting = false, string position = null) 
            where T : IConfigurator
        {
            if (values == null || values.Length == 0)
            {
                values = new string[] { "All", "10", "50", "100" };
            }
            if (defaultValue == null)
            {
                defaultValue = values[0];
            }
            
            LimitClientConfiguration limitPlugin = new LimitClientConfiguration()
            {
                DefaultValue = defaultValue,
                ReloadTableOnLimitChange = reloadTableOnLimitChange,
                EnableClientLimiting = enableCientLimiting
            };
            foreach (var value in values)
            {
                int v = 0;
                bool parsed = int.TryParse(value, out v);
                limitPlugin.AddValue(value, v);
            }
            configurator.TableConfiguration.ReplacePluginConfig(PluginId, limitPlugin, position);
            
            if (!values.Contains(defaultValue))
                throw new Exception("Limit menu default selected value does not belong to menu values");
            if (defaultValue.Trim()=="-")
                throw new Exception("Limit menu default selected value should not be a separator");

            return configurator;
        }
    }
}