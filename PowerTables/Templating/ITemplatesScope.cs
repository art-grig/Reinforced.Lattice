using System.IO;

namespace PowerTables.Templating
{
    /// <summary>
    /// Common interface for template scopes to make them embeddable to any page
    /// </summary>
    public interface ITemplatesScope
    {
        /// <summary>
        /// Reference to page's output stream
        /// </summary>
        TextWriter Output { get; }

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
