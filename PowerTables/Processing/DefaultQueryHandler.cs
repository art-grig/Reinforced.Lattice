using System.Linq;
using PowerTables.Configuration;

namespace PowerTables.Processing
{
    /// <summary>
    /// Default query handler implementation. Used if no IQueryHandler provided to tables handler
    /// </summary>
    public class DefaultQueryHandler<TSourceData, TTableData> : IQueryHandler<TSourceData, TTableData> where TTableData : new()
    {
        private Configurator<TSourceData, TTableData> _configuration;

        public void SetConfigurator(Configurator<TSourceData, TTableData> configurator)
        {
            _configuration = configurator;
        }

        /// <summary>
        /// Core method for applying paging to ordered and filtered source set
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source">FIltered and ordered source set</param>
        /// <param name="partition">Data partition request</param>
        /// <param name="totalCount">Returned total results count</param>
        /// <returns></returns>
        protected virtual IQueryable<T> ApplyPagingCore<T>(IQueryable<T> source, Partition partition, out long totalCount)
        {
            totalCount = -1;

            if (partition == null) return source;
            if (!partition.NoCount) totalCount = TotalCount(source);
            var result = source;
            if (partition.Skip != 0) result = result.Skip(partition.Skip);
            if (partition.Take != 0) result = result.Take(partition.Take);

            return result;
        }

        public virtual IQueryable<TSourceData> ApplyPaging(IQueryable<TSourceData> source, Partition partition, out long totalCount)
        {
            return ApplyPagingCore(source, partition, out totalCount);
        }

        /// <summary>
        /// Method that should return total count of records
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source">Data set</param>
        /// <returns>Records count</returns>
        protected virtual long TotalCount<T>(IQueryable<T> source)
        {
            return source.LongCount();
        }

        public virtual IQueryable<TSourceData> ApplyOrdering(IQueryable<TSourceData> source, Query request)
        {
            if (request.Orderings == null) return source;
            bool orderingPerformed = false;
            foreach (var ordering in request.Orderings)
            {
                if (ordering.Value == Ordering.Neutral) continue;
                var srcOrderingExpr = _configuration.GetOrderingExpression(ordering.Key);
                if (srcOrderingExpr == null) continue;

                if (ordering.Value == Ordering.Ascending)
                {
                    if (!orderingPerformed)
                    {
                        source = ReflectionCache.CallOrderBy(source, srcOrderingExpr, srcOrderingExpr.Body.Type);
                        orderingPerformed = true;
                    }
                    else
                    {
                        source = ReflectionCache.CallThenBy(source, srcOrderingExpr, srcOrderingExpr.Body.Type);
                    }
                }
                if (ordering.Value == Ordering.Descending)
                {
                    if (!orderingPerformed)
                    {
                        source = ReflectionCache.CallOrderByDescending(source, srcOrderingExpr,
                            srcOrderingExpr.Body.Type);
                        orderingPerformed = true;
                    }
                    else
                    {
                        source = ReflectionCache.CallThenByDescending(source, srcOrderingExpr,
                            srcOrderingExpr.Body.Type);
                    }
                }
            }
            if (!orderingPerformed && _configuration.FallbackOrdering != null)
            {
                source = ReflectionCache.CallOrderByDescending(source, _configuration.FallbackOrdering, _configuration.FallbackOrdering.Body.Type);
            }
            return source;
        }

        public virtual IQueryable<TSourceData> ApplyFiltering(IQueryable<TSourceData> source, Query request)
        {
            if (request.Filterings == null) return source;
            var filters = _configuration.GetFilters<TSourceData>();
            foreach (var filter in filters)
            {
                source = filter.Apply(source, request);
            }
            return source;
        }

        public virtual TTableData[] ApplyMapping(IQueryable<TSourceData> source, Query request)
        {
            if (_configuration.Projection != null)
            {
                var projected = _configuration.Projection(source).ToArray();
                return projected;
            }

            var data = source.ToArray().Select(sourceData => _configuration.Map(sourceData)).ToArray();
            return data;

        }
    }
}
