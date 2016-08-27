namespace PowerTables.Filters
{
    interface ITypedAndKeyedColumnFilter<TSourceData, TFilteringKey> : ITypedAndKeyedFilter<TSourceData, TFilteringKey>
        , IColumnFilter
    {
    }
}
