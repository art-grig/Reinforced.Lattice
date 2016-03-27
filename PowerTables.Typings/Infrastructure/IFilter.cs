namespace PowerTables.Typings.Infrastructure
{
    interface IFilter : IQueryPartProvider, IRenderable
    {
        void Reset();
    }
}
