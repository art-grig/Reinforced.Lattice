using System;
using System.Linq;
using PowerTables.Configuration;

namespace PowerTables.Filters
{
    /// <summary>
    /// Common extensions for flexible customization of all filters
    /// </summary>
    public static class FilterBaseExtensions
    {
        /// <summary>
        /// Replaces function that is been used for parsering values
        /// </summary>
        /// <typeparam name="TSourceData">Source data</typeparam>
        /// <typeparam name="TFilteringKey">Filtering key</typeparam>
        /// <param name="columnFilter">Filter itself</param>
        /// <param name="extractFunction">Function that will be used to convert client's string value for filter to <typeparamref name="TFilteringKey"/></param>
        /// <returns></returns>
        public static FilterBase<TSourceData, TFilteringKey> Value<TSourceData, TFilteringKey>(
            this FilterBase<TSourceData, TFilteringKey> columnFilter, Func<PowerTables.Query, Tuple<bool,TFilteringKey>> extractFunction)
        {
            columnFilter.ExtractFunction = extractFunction;
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
        public static FilterBase<TSourceData, TFilteringKey> By<TSourceData, TFilteringKey>(
            this FilterBase<TSourceData, TFilteringKey> columnFilter, Func<IQueryable<TSourceData>, TFilteringKey, IQueryable<TSourceData>> filterFunction)
        {
            columnFilter.FilterFunction = filterFunction;
            return columnFilter;
        }

        

        
    }
}
