using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

using PowerTables.Configuration;

namespace PowerTables.Filters
{
    /// <summary>
    /// Base class for custom filters. 
    /// See <see cref="ColumnFilterExtensions"/>
    /// </summary>
    /// <typeparam name="TSourceData">Type of source set</typeparam>
    /// <typeparam name="TFilteringKey">Type of target set</typeparam>
    public abstract class ColumnFilterBase<TSourceData, TFilteringKey> : FilterBase<TSourceData, TFilteringKey>,
        ITypedAndKeyedColumnFilter<TSourceData, TFilteringKey>
    {
        /// <summary>
        /// Column name which this filter belongs to
        /// </summary>
        public string ColumnName { get; set; }

        /// <summary>
        /// Overrides function that will be used to convert client-side filter arguments to server-side ones
        /// </summary>
        public Func<string, TFilteringKey> ParseFunction { get; internal set; }

        /// <summary>
        /// It is default value for ParseFunction. You need to implement it.
        /// </summary>
        /// <param name="filterArgument">Filter arguments from client-side</param>
        /// <returns>Filter key</returns>
        protected abstract TFilteringKey Parse(string filterArgument);

        protected ColumnFilterBase(string columnName, IConfigurator configurator)
            : base(configurator)
        {
            ParseFunction = Parse;
            ColumnName = columnName;
        }
        
        protected override Tuple<bool, TFilteringKey> DefaultExtract(Query filterArgument)
        {
            string filterValue = null;
            bool presentFiltering = filterArgument.Filterings.TryGetValue(ColumnName, out filterValue);
            if (string.IsNullOrEmpty(filterValue)) presentFiltering = false;
            if (!presentFiltering) return FilterTuple.None<TFilteringKey>();
            TFilteringKey key = ParseFunction(filterValue);
            return key.ToFilterTuple();
        }
    }
}
