using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Filters
{
    /// <summary>
    /// Base interface for all filters. 
    /// It consists of only single method that applies filter to source set and 
    /// retrieves filtered data set.
    /// </summary>
    public interface ITypedFilter<TSourceData> : IFilter
    {
        /// <summary>
        /// Method that is being called to apply filter. 
        /// </summary>
        /// <param name="source">Source data set</param>
        /// <param name="request">Client request</param>
        /// <returns>Filtered data set</returns>
        IQueryable<TSourceData> Apply(IQueryable<TSourceData> source, Query request);
    }
}
