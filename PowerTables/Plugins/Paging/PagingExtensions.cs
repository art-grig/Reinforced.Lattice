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
        /// Attaches data pager to table. 
        /// This method attaches quite simple data pager containing only previous and next buttons allowing 
        /// to iterate table by single page forward or backward. 
        /// Optionally you can use "Go To Page" feature.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="position">Visual plugin position. See <see cref="PluginPosition"/></param>
        /// <param name="previousHtml">HTML content for "previous" button</param>
        /// <param name="nextHtml">HTML content for "next" button</param> 
        /// <param name="useGotoPage">
        /// When true, adds visual element that consists of small textbox and "go" button 
        /// to make it easier to navigate to page specified
        /// </param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> PagingWithArrows<TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf,
            PluginPosition position = PluginPosition.RightBottom,
            string previousHtml = null,
            string nextHtml = null,
            bool useGotoPage = false
            ) where TTableData : new()
        {
            PagingClientConfiguration pcf = new PagingClientConfiguration
            {
                ArrowsMode = true,
                PreviousText = previousHtml,
                NextText = nextHtml,
                UseGotoPage = useGotoPage

            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId, pcf, position);
            return conf;
        }

        /// <summary>
        /// Attaches data pager to table. 
        /// This pager is more complex. It contains all the available pages and also 
        /// hides some page numbers with "period" to squeeze place behold by pager. 
        /// Hiding logic is adjustable. 
        /// Optionally you can use "Go To Page" feature.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="position">Visual plugin position. See <see cref="PluginPosition"/></param>
        /// <param name="hidePages">Minimum number of pages to hide behind periods</param>
        /// <param name="useGotoPage">
        /// When true, adds visual element that consists of small textbox and "go" button 
        /// to make it easier to navigate to page specified
        /// </param>
        /// <param name="useFirstLasPage">Display buttons for quick navigation to first and last page</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> PagingWithPeriods<TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf,
            PluginPosition position = PluginPosition.RightBottom,
            int hidePages = 3,
            bool useGotoPage = false,
            bool useFirstLasPage = false
            ) where TTableData : new()
        {
            PagingClientConfiguration pcf = new PagingClientConfiguration
            {
                ArrowsMode = false,
                UsePeriods = true,
                PagesToHideUnderPeriod = hidePages,
                UseGotoPage = useGotoPage,
                UseFirstLastPage = useFirstLasPage
            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId, pcf, position);
            return conf;
        }

        /// <summary>
        /// Attaches data pager to table. 
        /// This is simple pager that displays all of available pages and allows to navigate 
        /// to each page directly.
        /// </summary>
        /// <param name="conf">Table configurator</param>
        /// <param name="position">Visual plugin position. See <see cref="PluginPosition"/></param>
        /// <param name="useGotoPage">
        /// When true, adds visual element that consists of small textbox and "go" button 
        /// to make it easier to navigate to page specified
        /// </param>
        /// <param name="useFirstLasPage">Display buttons for quick navigation to first and last page</param>
        /// <returns></returns>
        public static Configurator<TSourceData, TTableData> PagingSimple<TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> conf,
            PluginPosition position = PluginPosition.RightBottom,
            bool useGotoPage = false,
            bool useFirstLasPage = false
            ) where TTableData : new()
        {
            PagingClientConfiguration pcf = new PagingClientConfiguration
            {
                ArrowsMode = false,
                UsePeriods = false,
                UseGotoPage = useGotoPage,
                UseFirstLastPage = useFirstLasPage
            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId, pcf, position);
            return conf;
        }
    }
}
