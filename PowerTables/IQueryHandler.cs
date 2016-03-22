using System.Linq;
using System.Web.Mvc;
using PowerTables.Configuration;

namespace PowerTables
{
    /// <summary>
    /// Query handler interface. The implementor is responsible for manipulation with source data based on table consifuration and original request
    /// </summary>
    /// <typeparam name="TSourceData">Source data type</typeparam>
    /// <typeparam name="TTableData">Table row type</typeparam>
    public interface IQueryHandler<TSourceData, TTableData> where TTableData : new()
    {
        /// <summary>
        /// Stores table configurator in ther QueryHandler interface
        /// </summary>
        /// <param name="configurator">Configuration</param>
        void SetConfigurator(Configurator<TSourceData, TTableData> configurator);

        /// <summary>
        /// Applies paging to source set
        /// </summary>
        /// <param name="source">Source set</param>
        /// <param name="request">Request</param>
        /// <param name="totalCount">Total data count in source request</param>
        /// <param name="pageIndex">Resulting page index (if total data count is less than requested)</param>
        /// <param name="resultsOnPage">Results count on current page</param>
        /// <returns>Paged source set</returns>
        IQueryable<TSourceData> ApplyPaging(IQueryable<TSourceData> source, Query request, out long totalCount, out int pageIndex);

        /// <summary>
        /// Applies ordering to source set
        /// </summary>
        /// <param name="source">Source set</param>
        /// <param name="request">Request</param>
        /// <returns>Ordered source set</returns>
        IQueryable<TSourceData> ApplyOrdering(IQueryable<TSourceData> source, Query request);

        /// <summary>
        /// Applies filtering to source set
        /// </summary>
        /// <param name="source">Source set</param>
        /// <param name="request">Request</param>
        /// <returns>Filtered source set</returns>
        IQueryable<TSourceData> ApplyFiltering(IQueryable<TSourceData> source, Query request);

        /// <summary>
        /// Converts source set to set of target data type
        /// </summary>
        /// <param name="source">Source set</param>
        /// <param name="request">Request</param>
        /// <returns>Table rows set</returns>
        TTableData[] ApplyMapping(IQueryable<TSourceData> source, Query request);

        /// <summary>
        /// Extracts request from controller context. 
        /// Beware of handling deferred tokens when overriding this method. 
        /// </summary>
        /// <param name="context">Controller context</param>
        /// <returns>Request instance</returns>
        PowerTableRequest ExtractRequest(ControllerContext context);
    }
}
