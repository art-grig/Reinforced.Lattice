﻿using System;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.Limit
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
        /// <param name="ui">Limit filter UI configuration</param>
        /// <param name="where">Plugin placement - to distinguish which instance to update. Can be omitted if you have single plugin instance per table.</param>
        /// <returns></returns>
        public static T Limit<T>(this T configurator, Action<PluginConfigurationWrapper<LimitClientConfiguration>> ui, string where = null)
            where T : IConfigurator
        {
            configurator.TableConfiguration.UpdatePluginConfig(PluginId, ui, where);
            return configurator;
        }

        /// <summary>
        /// Specifies limiting possible volumes
        /// </summary>
        /// <param name="conf"></param>
        /// <param name="values">Limiting values</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<LimitClientConfiguration> Values(this PluginConfigurationWrapper<LimitClientConfiguration> conf, string[] values)
        {
            conf.Configuration.LimitLabels.Clear();
            conf.Configuration.LimitValues.Clear();

            foreach (var value in values)
            {
                int v = 0;
                int.TryParse(value, out v);
                if (value == "-") v = -1;
                conf.Configuration.AddValue(value, v);
            }
            return conf;
        }

        /// <summary>
        /// Adds limit value
        /// </summary>
        /// <param name="limitLabel">Label</param>
        /// <param name="limitValue">Value</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<LimitClientConfiguration> AddValue(this PluginConfigurationWrapper<LimitClientConfiguration> c, string limitLabel, int limitValue)
        {
            c.Configuration.LimitLabels.Add(limitLabel);
            c.Configuration.LimitValues.Add(limitValue);
            return c;
        }
        
    }
}