namespace Reinforced.Lattice.Templating
{
    /// <summary>
    /// Views plugins classifier
    /// </summary>
    public interface IViewPlugins
    {
        /// <summary>
        /// Output view text writer
        /// </summary>
        ITemplatesScope Scope { get; }

        /// <summary>
        /// Templates page model
        /// </summary>
        LatticeTemplatesViewModel Model { get; }
    }
}
