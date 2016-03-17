using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Filters
{
    /// <summary>
    /// Base for all filters. 
    /// See <see cref="FilterBaseExtensions"/>
    /// </summary>
    /// <typeparam name="TSourceData"></typeparam>
    /// <typeparam name="TFilteringKey"></typeparam>
    public abstract class FilterBase<TSourceData, TFilteringKey> : ITypedAndKeyedFilter<TSourceData,TFilteringKey>
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="configurator">Reference to table configurator</param>
        protected FilterBase(IConfigurator configurator)
        {
            Configurator = configurator;
            ExtractFunction = DefaultExtract;
            FilterFunction = DefaultFilter;
        }

        /// <summary>
        /// Method that applies filter to source sequence
        /// </summary>
        /// <param name="source">Source sequence</param>
        /// <param name="arguments">String filter arguments from client side</param>
        /// <returns>Resulting queryable</returns>
        public virtual IQueryable<TSourceData> Apply(IQueryable<TSourceData> source, Query arguments)
        {
            var k = ExtractFunction(arguments);
            if (!k.Item1) return source;
            TFilteringKey key = k.Item2;
            return FilterFunction(source, key);
        }

        /// <summary>
        /// Reference to table configurator
        /// </summary>
        public virtual IConfigurator Configurator { get; private set; }

        public Func<IQueryable<TSourceData>, TFilteringKey, IQueryable<TSourceData>> FilterFunction { get; set; }
        
        public Func<Query, Tuple<bool,TFilteringKey>> ExtractFunction { get; set; }

        /// <summary>
        /// Delegate for extracting filter key from query that comes from client-side
        /// </summary>
        /// <param name="filterArgument">Query from client-side</param>
        /// <returns>Tuple. 1st item is bool, denoting is value for filter specified (which controls will filter apply or not). 2nd value is the filter value itself</returns>
        protected abstract Tuple<bool, TFilteringKey> DefaultExtract(Query filterArgument);

        /// <summary>
        /// It is default value for FilterFunction. You need to implement it. 
        /// </summary>
        /// <param name="source">Source sequence</param>
        /// <param name="key">Filter key converted from client arguments using ParseFunction</param>
        /// <returns>resulting sequence</returns>
        protected abstract IQueryable<TSourceData> DefaultFilter(IQueryable<TSourceData> source, TFilteringKey key);
        


    }
}
