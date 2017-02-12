namespace Reinforced.Lattice.Filters
{
    interface ITypedAndKeyedColumnFilter<TSourceData, TFilteringKey> : ITypedAndKeyedFilter<TSourceData, TFilteringKey>
        , IColumnFilter
    {
    }
}
