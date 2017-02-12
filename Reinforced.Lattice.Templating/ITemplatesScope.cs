namespace Reinforced.Lattice.Templating
{
    /// <summary>
    /// Common interface for template scopes to make them embeddable to any page
    /// </summary>
    public interface ITemplatesScope : IRawProvider
    {
        /// <summary>
        /// Internal information about template scope
        /// </summary>
        TemplateControl Flow { get; }

        /// <summary>
        /// Templates prefix
        /// </summary>
        string TemplatesPrefix { get; }

        /// <summary>
        /// Plugins collection
        /// </summary>
        IViewPlugins Plugin { get; }
    }
}
