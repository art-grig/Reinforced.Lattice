namespace Reinforced.Lattice.Configuration
{
    /// <summary>
    /// Generic interface for column where no additional properties matters, only target row type
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IColumnTargetProperty<T> : IColumnConfigurator
    {
    }
}
