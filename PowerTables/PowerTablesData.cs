using System;
using System.Linq;
using PowerTables.Configuration;

namespace PowerTables
{
    /// <summary>
    /// Various sets of source data, selected and collected for response construction
    /// </summary>
    public class PowerTablesData
    {
        /// <summary>
        /// Source set
        /// </summary>
        public IQueryable Source { get; private set; }

        /// <summary>
        /// "Source" property with filters applied
        /// </summary>
        public IQueryable Filtered { get; private set; }

        /// <summary>
        /// "Filtered" property ordered according to table orderings
        /// </summary>
        public IQueryable Ordered { get; private set; }

        /// <summary>
        /// Part of data cut from "Ordered" property to required page and rows per page
        /// </summary>
        public IQueryable Paged { get; private set; }

        /// <summary>
        /// "Paged" data converted to set of target rows type
        /// </summary>
        public Lazy<object[]> Mapped { get; private set; }

        /// <summary>
        /// Table configurator
        /// </summary>
        public IConfigurator Configuration { get; private set; }

        /// <summary>
        /// Original request
        /// </summary>
        public PowerTableRequest Request { get; private set; }

        /// <summary>
        /// Total results count. Similar to "Ordered".Count()
        /// </summary>
        public int ResultsCount { get; private set; }

        /// <summary>
        /// Current data page index
        /// </summary>
        public int CurrentPage { get; private set; }
       
        public IQueryable<T> Set<T>(TableDataSet set)
        {
            switch (set)
            {
                case TableDataSet.Filtered:
                    return (IQueryable<T>)Filtered;
                case TableDataSet.Mapped:
                    return (IQueryable<T>)Mapped;
                case TableDataSet.Ordered:
                    return (IQueryable<T>)Ordered;
                case TableDataSet.Paged:
                    return (IQueryable<T>)Paged;
                case TableDataSet.Source:
                    return (IQueryable<T>)Source;
            }
            return null;
        }

        /// <summary>
        /// It is dirty hack to workaround arrays covariance problems
        /// </summary>
        internal object _OriginalLazy;

        public PowerTablesData(IQueryable source, IQueryable filtered, IQueryable ordered, IQueryable paged, Lazy<object[]> mapped, IConfigurator configuration, PowerTableRequest request, int resultsCount, int currentPage)
        {
            Source = source;
            Filtered = filtered;
            Ordered = ordered;
            Paged = paged;
            Mapped = mapped;
            Configuration = configuration;
            Request = request;
            ResultsCount = resultsCount;
            CurrentPage = currentPage;
        }
    }

    /// <summary>
    /// Various sets of source data, selected and collected for response construction, strongly typed
    /// </summary>
    public class PowerTablesData<TSourceData, TTableData> where TTableData : new()
    {
        /// <summary>
        /// Source set
        /// </summary>
        public IQueryable<TSourceData> Source { get; private set; }
        /// <summary>
        /// "Source" property with filters applied
        /// </summary>
        public IQueryable<TSourceData> Filtered { get; private set; }
        /// <summary>
        /// "Filtered" property ordered according to table orderings
        /// </summary>
        public IQueryable<TSourceData> Ordered { get; private set; }
        /// <summary>
        /// Part of data cut from "Ordered" property to required page and rows per page
        /// </summary>
        public IQueryable<TSourceData> Paged { get; private set; }
        /// <summary>
        /// "Paged" data converted to set of target rows type
        /// </summary>
        public Lazy<TTableData[]> Mapped { get; private set; }
        /// <summary>
        /// Table configurator
        /// </summary>
        public Configurator<TSourceData, TTableData> Configuration { get; private set; }
        /// <summary>
        /// Original request
        /// </summary>
        public PowerTableRequest Request { get; private set; }
        /// <summary>
        /// Total results count. Similar to "Ordered".Count()
        /// </summary>
        public int ResultsCount { get; private set; }
        /// <summary>
        /// Current data page index
        /// </summary>
        public int CurrentPage { get; private set; }
       
        public PowerTablesData(PowerTablesData coreData)
        {
            Source = (IQueryable<TSourceData>)coreData.Source;
            Filtered = (IQueryable<TSourceData>)coreData.Filtered;
            Ordered = (IQueryable<TSourceData>)coreData.Ordered;
            Paged = (IQueryable<TSourceData>)coreData.Paged;
            Mapped = (Lazy<TTableData[]>)coreData._OriginalLazy;
            Configuration = (Configurator<TSourceData, TTableData>)coreData.Configuration;
            Request = coreData.Request;
            ResultsCount = coreData.ResultsCount;
            CurrentPage = coreData.CurrentPage;
        }
    }

    public enum TableDataSet
    {
        Source,
        Filtered,
        Ordered,
        Paged,
        Mapped
    }
}
