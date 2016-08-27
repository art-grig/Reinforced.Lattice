using System;
using System.Linq;
using PowerTables.Configuration;

namespace PowerTables.Filters
{
    /// <summary>
    /// The "free" filter that is not tied to any column. 
    /// See <see cref="FreeFilterExtensions"/>
    /// </summary>
    public class FreeFilter<TSourceData, TFilteringKey> : FilterBase<TSourceData, TFilteringKey>
    {
        internal FreeFilter(IConfigurator configurator) : base(configurator)
        {
        }

        protected override IQueryable<TSourceData> DefaultFilter(IQueryable<TSourceData> source, TFilteringKey key)
        {
            throw new Exception("Filter function is not configured for Free Filter. Use .By extension method to configure it.");
        }

        protected override Tuple<bool, TFilteringKey> DefaultExtract(Query filterArgument)
        {
            throw new Exception("Extract function is not configured for Free Filter. Use .Value extension method to configure it.");
        }
    }
}
