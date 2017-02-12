using System;
using System.Linq;

namespace Reinforced.Lattice.Filters
{
    /// <summary>
    /// Represents typed filter with functions for applying filter and extracting filter parameters
    /// </summary>
    /// <typeparam name="TSourceData">Source table data</typeparam>
    /// <typeparam name="TFilteringKey">Filtering key type</typeparam>
    public interface ITypedAndKeyedFilter<TSourceData,TFilteringKey> : ITypedFilter<TSourceData>, IKeyedFilter<TFilteringKey>
    {
        /// <summary>
        /// Overrides function that will be used for filtering itself
        /// </summary>
        Func<IQueryable<TSourceData>, TFilteringKey, IQueryable<TSourceData>> FilterFunction { get; }

        
    }
}
