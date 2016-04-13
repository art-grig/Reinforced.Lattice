using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Filters
{
    /// <summary>
    /// Extensions for every ColumnFilter
    /// </summary>
    public static class ColumnFilterExtensions
    {
        /// <summary>
        /// Replaces function that is been used for parsering values
        /// </summary>
        /// <typeparam name="TSourceData">Source data</typeparam>
        /// <typeparam name="TFilteringKey">Filtering key</typeparam>
        /// <param name="columnFilter">Filter itself</param>
        /// <param name="parseFunction">Function that will be used to convert client's string value for filter to <typeparamref name="TFilteringKey"/></param>
        /// <returns></returns>
        public static ColumnFilterBase<TSourceData, TFilteringKey> RawValue<TSourceData, TFilteringKey>(
            this ColumnFilterBase<TSourceData, TFilteringKey> columnFilter, Func<string, TFilteringKey> parseFunction)
        {
            columnFilter.ParseFunction = parseFunction;
            return columnFilter;
        }

        /// <summary>
        /// Replaces filtering function that will be applied to source set to generate resulting set
        /// </summary>
        /// <typeparam name="TSourceData">Source data</typeparam>
        /// <typeparam name="TFilteringKey">Filtering key</typeparam>
        /// <param name="columnFilter">Filter itself</param>
        /// <param name="filterFunction">Function that will be invoked to filter source set using <typeparamref name="TFilteringKey"/> parameter</param> 
        /// <returns></returns>
        public static ColumnFilterBase<TSourceData, TFilteringKey> By<TSourceData, TFilteringKey>(
            this ColumnFilterBase<TSourceData, TFilteringKey> columnFilter, Func<IQueryable<TSourceData>, TFilteringKey, IQueryable<TSourceData>> filterFunction)
        {
            columnFilter.FilterFunction = filterFunction;
            return columnFilter;
        }

        /// <summary>
        /// Retrieves column filter value from incoming request. 
        /// Please not that RangeFilter uses RangeTuple as TFilteringKey 
        /// </summary>
        /// <typeparam name="TFilteringKey">Type of filter key</typeparam>
        /// <param name="column">Column</param>
        /// <param name="query">Query of incoming request</param>
        /// <returns></returns>
        public static Tuple<bool, TFilteringKey> ExtractFilteringKey<TFilteringKey>(
            this IColumnConfigurator column, Query query)
        {
            var columnName = column.ColumnConfiguration.RawColumnName;
            var colFilter = column.TableConfigurator.GetFilter(columnName);

            if (colFilter != null)
            {
                var cf = colFilter as IKeyedFilter<TFilteringKey>;
                if (cf == null)
                {
                    throw new Exception(string.Format("Filtering key type mismatch. Filter on column '{0}' extracts its data not as '{1}'",
                        columnName,typeof(TFilteringKey).Name));
                }
                return cf.ExtractFunction(query);
            }
            return new Tuple<bool, TFilteringKey>(false, default(TFilteringKey));
        }

        /// <summary>
        /// Retrieves column filter value from incoming request. 
        /// Please not that RangeFilter uses RangeTuple as TFilteringKey 
        /// </summary>
        /// <typeparam name="TFilteringKey">Type of filter key</typeparam>
        /// <param name="column">Column</param>
        /// <param name="request">Incoming request</param>
        /// <returns></returns>
        public static Tuple<bool, TFilteringKey> ExtractFilteringKey<TFilteringKey>(
            this IColumnConfigurator column, PowerTableRequest request)
        {
            return ExtractFilteringKey<TFilteringKey>(column, request.Query);
        }

    }
}
