using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.Filters
{
    /// <summary>
    /// Base, non-generic interface for every filter. 
    /// It even cannot be applied. This interface exists only 
    /// for easier type-safe storing inside configurator. 
    /// </summary>
    public interface IFilter
    {
        /// <summary>
        /// Reference to configurator that this filter registered in
        /// </summary>
        IConfigurator Configurator { get; }
    }
}