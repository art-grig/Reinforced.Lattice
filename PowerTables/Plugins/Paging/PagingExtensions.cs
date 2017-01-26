﻿using System;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Paging
{
    /// <summary>
    /// Extension methods for paging plugin
    /// </summary>
    public static class PagingExtensions
    {
        public const string PluginId = "Paging";

        /// <summary>
        /// Attaches data pager to table
        /// </summary>
        /// <param name="conf"></param>
        /// <param name="ui">Pager UI configuration</param>
        /// <param name="where">Plugin placement - to distinguish which instance to update. Can be omitted if you have single plugin instance per table.</param>
        /// <returns></returns>
        public static T Paging<T>(this T conf, Action<PluginConfigurationWrapper<PagingClientConfiguration>> ui, string where = null) where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig(PluginId, ui, where);
            return conf;
        }

        /// <summary>
        /// Configures data pager
        /// This method attaches quite simple data pager containing only previous and next buttons allowing 
        /// to iterate table by single page forward or backward. 
        /// Optionally you can use "Go To Page" feature.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<PagingClientConfiguration> PagingWithArrows(
            this PluginConfigurationWrapper<PagingClientConfiguration> conf
            )
        {

            conf.Configuration.ArrowsMode = true;
            return conf;
        }

        /// <summary>
        /// Configures data pager
        /// This pager is more complex. It contains all the available pages and also 
        /// hides some page numbers with "period" to squeeze place behold by pager. 
        /// Hiding logic is adjustable. 
        /// Optionally you can use "Go To Page" feature.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="hidePages">Minimum number of pages to hide behind periods</param>
        /// <param name="useFirstLasPage">Display buttons for quick navigation to first and last page</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<PagingClientConfiguration> PagingWithPeriods(
            this PluginConfigurationWrapper<PagingClientConfiguration> conf,
            int hidePages = 3,
            bool useFirstLasPage = false
            )
        {
            conf.Configuration.ArrowsMode = false;
            conf.Configuration.UsePeriods = true;
            conf.Configuration.PagesToHideUnderPeriod = hidePages;
            conf.Configuration.UseFirstLastPage = useFirstLasPage;
            return conf;
        }

        /// <summary>
        /// Configures data pager
        /// This is simple pager that displays all of available pages and allows to navigate 
        /// to each page directly.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="useFirstLasPage">Display buttons for quick navigation to first and last page</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<PagingClientConfiguration> PagingSimple(
            this PluginConfigurationWrapper<PagingClientConfiguration> conf,
            bool useFirstLasPage = false
            )
        {

            conf.Configuration.ArrowsMode = false;
            conf.Configuration.UsePeriods = false;
            conf.Configuration.UseFirstLastPage = useFirstLasPage;
            return conf;
        }

        /// <summary>
        /// Adds visual element that consists of small textbox and "go" button 
        /// to make it easier to navigate to page specified
        /// </summary>
        /// <param name="c"></param>
        /// <param name="use">Use goto page</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<PagingClientConfiguration> UseGotoPage(this PluginConfigurationWrapper<PagingClientConfiguration> c, bool use = true)
        {
            c.Configuration.UseGotoPage = use;
            return c;
        }
    }
}
