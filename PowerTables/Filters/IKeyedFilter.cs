using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Filters
{
    /// <summary>
    /// Filter with extracting function
    /// </summary>
    /// <typeparam name="TFilteringKey">Type of filtering key</typeparam>
    public interface IKeyedFilter<TFilteringKey> : IFilter
    {
        /// <summary>
        /// Overrides function that will be used to convert client-side filter arguments to server-side ones
        /// </summary>
        Func<Query, Tuple<bool, TFilteringKey>> ExtractFunction { get; }
    }
}
