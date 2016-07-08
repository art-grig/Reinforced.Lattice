using System.IO;
using System.Linq;
using System.Web.Mvc;
using Newtonsoft.Json;
using PowerTables.Configuration;

namespace PowerTables.Defaults
{
    /// <summary>
    /// Default query handler implementation. Used if no IQueryHandler provided to tables handler
    /// </summary>
    public class DefaultQueryHandler<TSourceData, TTableData> : IQueryHandler<TSourceData, TTableData> where TTableData : new()
    {
        private PowerTableRequest _request;
        public virtual PowerTableRequest ExtractRequest(ControllerContext context)
        {
            if (_request != null) return _request;

            if (context.HttpContext.Request.HttpMethod == "GET")
            {
                var token = context.HttpContext.Request.QueryString["q"];
                _request = InMemoryTokenStorage.Lookup(token);
                return _request;
            }

            var request = context.RequestContext.HttpContext.Request;
            request.InputStream.Seek(0, SeekOrigin.Begin);
            string jsonData = new StreamReader(request.InputStream).ReadToEnd();
            _request = JsonConvert.DeserializeObject<PowerTableRequest>(jsonData);
            _request.Configurator = _configuration;
            return _request;
        }

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
        /// <param name="request">Request object</param>
        /// <param name="totalCount">Returned total results count</param>
        /// <param name="pageIndex">Current pag index</param>
        /// <returns></returns>
        protected virtual IQueryable<T> ApplyPagingCore<T>(IQueryable<T> source, Query request, out long totalCount, out int pageIndex)
        {
            totalCount = 0;
            pageIndex = 0;

            if (request.Paging == null) return source;
            if (request.Paging.PageSize == 0) return source;

            totalCount = TotalCount(source);
            var startingElement = request.Paging.PageSize * request.Paging.PageIndex + 1;
            pageIndex = request.Paging.PageIndex;
            if (startingElement > totalCount)
            {
                startingElement = 1; //take first page if desired page does not exist
                pageIndex = 0;
            }

            var result = source.Skip(startingElement - 1).Take(request.Paging.PageSize);
            return result;
        }

        public virtual IQueryable<TSourceData> ApplyPaging(IQueryable<TSourceData> source, Query request, out long totalCount, out int pageIndex)
        {
            return ApplyPagingCore(source, request, out totalCount, out pageIndex);
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
