using System;
using System.Linq;
using System.Linq.Expressions;
using PowerTables.Configuration;

namespace PowerTables.Filters
{
    /// <summary>
    /// Extensions for free filter
    /// </summary>
    public static class FreeFilterExtensions
    {
        /// <summary>
        /// Sets up free initial data filtering for query. 
        /// Free filter is able to extract filtering key from anywhere in any manner and 
        /// apply filtering based on it to source data sequence. 
        /// It is not bound to any column and has no UI. 
        /// </summary>
        /// <param name="configurator">Table configurator</param>
        /// <param name="extractFunction">Function that should extract filtering tuple</param>
        /// <param name="filterFunction">Function that should be applied to filter sequence</param>
        public static void FreeFilter
            <TSourceData, TFilteringKey, TTableData>(
            this Configurator<TSourceData, TTableData> configurator,
            Func<Query, Tuple<bool, TFilteringKey>> extractFunction,
            Func<IQueryable<TSourceData>, TFilteringKey, IQueryable<TSourceData>> filterFunction
            ) where TTableData : new()
        {
            var f = new FreeFilter<TSourceData, TFilteringKey>(configurator);
            f.Value(extractFunction).By(filterFunction);
            configurator.RegisterFilter(f);
        }

        /// <summary>
        /// Sets up free initial data ordering for query. 
        /// Free ordering is able to extract ordering direction from anywhere in any manner and 
        /// apply ordering based on it to source data sequence. 
        /// It is not bound to any column and has no UI. 
        /// </summary>
        /// <param name="configurator">Table configurator</param>
        /// <param name="orderingExtractFunction">Ordering extraction function</param>
        /// <param name="orderingColumn">Column to apply ordering</param>
        public static void FreeOrdering
            <TSourceData, TValue, TTableData>(
            this Configurator<TSourceData, TTableData> configurator,
            Func<Query, Tuple<bool, Ordering>> orderingExtractFunction,
            Expression<Func<TSourceData, TValue>> orderingColumn
            ) where TTableData : new()
        {
            var f = new FreeFilter<TSourceData, Ordering>(configurator);
            f.Value(orderingExtractFunction);
            f.By((source, ordering) =>
            {
                switch (ordering)
                {
                    case Ordering.Neutral: return source;
                    case Ordering.Ascending: return source.OrderBy(orderingColumn);
                    case Ordering.Descending: return source.OrderByDescending(orderingColumn);
                }
                return source;
            });
            configurator.RegisterFilter(f);
        }

        
    }
}
