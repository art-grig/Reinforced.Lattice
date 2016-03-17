namespace PowerTables.Typings.Infrastructure
{
    interface IFilter : IQueryPartProvider, IRenderableComponent
    {
        void Reset();
    }
}
