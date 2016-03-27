using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Typings.Infrastructure
{
    /// <summary>
    /// Renderable entity
    /// </summary>
    interface IRenderable
    {
        /// <summary>
        /// Renders whole element to string using templates provider
        /// </summary>
        /// <param name="templatesProvider">Cached templates provider</param>
        /// <returns>String containing HTML code for element</returns>
        string RenderElement(ITemplatesProvider templatesProvider);


        /// <summary>
        /// Renders element to HTML string using templates provider
        /// </summary>
        /// <param name="templatesProvider">Cached templates provider</param>
        /// <returns>String containing HTML code for element</returns>
        string RenderContent(ITemplatesProvider templatesProvider);


    }
}
