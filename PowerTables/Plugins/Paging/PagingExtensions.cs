using System;
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
        public static Configurator<TSourceData, TTableData> Paging<TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf,
            Action<IPluginConfiguration<PagingClientConfiguration>> ui,
            string where = null
            ) where TTableData : new()
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
        /// <param name="useGotoPage">
        /// When true, adds visual element that consists of small textbox and "go" button 
        /// to make it easier to navigate to page specified
        /// </param>
        /// <returns></returns>
        public static PagingClientConfiguration PagingWithArrows(
            this PagingClientConfiguration conf,
            bool useGotoPage = false
            )
        {

            conf.ArrowsMode = true;
            conf.UseGotoPage = useGotoPage;
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
        /// <param name="useGotoPage">
        /// When true, adds visual element that consists of small textbox and "go" button 
        /// to make it easier to navigate to page specified
        /// </param>
        /// <param name="useFirstLasPage">Display buttons for quick navigation to first and last page</param>
        /// <returns></returns>
        public static PagingClientConfiguration PagingWithPeriods(
            this PagingClientConfiguration conf,
            int hidePages = 3,
            bool useGotoPage = false,
            bool useFirstLasPage = false
            )
        {
            conf.ArrowsMode = false;
            conf.UsePeriods = true;
            conf.PagesToHideUnderPeriod = hidePages;
            conf.UseGotoPage = useGotoPage;
            conf.UseFirstLastPage = useFirstLasPage;
            return conf;
        }

        /// <summary>
        /// Configures data pager
        /// This is simple pager that displays all of available pages and allows to navigate 
        /// to each page directly.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="useGotoPage">
        /// When true, adds visual element that consists of small textbox and "go" button 
        /// to make it easier to navigate to page specified
        /// </param>
        /// <param name="useFirstLasPage">Display buttons for quick navigation to first and last page</param>
        /// <returns></returns>
        public static PagingClientConfiguration PagingSimple(
            this PagingClientConfiguration conf,
            bool useGotoPage = false,
            bool useFirstLasPage = false
            )
        {

            conf.ArrowsMode = false;
            conf.UsePeriods = false;
            conf.UseGotoPage = useGotoPage;
            conf.UseFirstLastPage = useFirstLasPage;
            return conf;
        }
        
        /// <summary>
        /// When client paging is enabled, paging requests will not be passed to server. Client will load unpaged data and page it manually on client-side
        /// </summary>
        /// <param name="c"></param>
        /// <param name="enable">Enable or disable client paging</param>
        /// <returns></returns>
        public static PagingClientConfiguration EnableClientPaging(this PagingClientConfiguration c, bool enable = true)
        {
            c.EnableClientPaging = enable;
            return c;
        }
    }
}
