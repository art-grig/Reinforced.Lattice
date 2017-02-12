using System.Linq;
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
        /// <param name="partition">Partition request</param>
        /// <param name="totalCount">Total data count in source request</param>
        /// <returns>Paged source set</returns>
        IQueryable<TSourceData> ApplyPaging(IQueryable<TSourceData> source, Partition partition, out long totalCount);

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
    }
}
