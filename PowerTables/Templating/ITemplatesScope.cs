using System.IO;

namespace PowerTables.Templating
{
    /// <summary>
    /// Common interface for template scopes to make them embeddable to any page
    /// </summary>
    public interface ITemplatesScope: IRawProvider
    {
        /// <summary>
        /// Reference to page's output stream
        /// </summary>
        TextWriter Out { get; }

        /// <summary>
        /// Templates prefix
        /// </summary>
        string TemplatesPrefix { get; }

        /// <summary>
        /// Plugins collection
        /// </summary>
        IViewPlugins Plugin { get; }

        bool CrunchingTemplate { get; set; }
    }
}
