using System;
using System.Web.Mvc;
using Newtonsoft.Json;

// ReSharper disable InconsistentNaming

namespace PowerTables.Templating
{
    /// <summary>
    /// Helper extensions for rendering
    /// </summary>
    public static class TemplatingExtensions
    {
        /// <summary>
        /// Begins region containing additional Lattice templates
        /// </summary>
        /// <param name="page">Web page where you want to begin additional templates region</param>
        /// <param name="templatesPrefix">Templates prefix for </param>
        /// <returns></returns>
        public static AdditionalTemplatesScope LatticeAdditionalTemplates(this WebViewPage page, string templatesPrefix = "lt")
        {
            return new AdditionalTemplatesScope(page, templatesPrefix);
        }
        
        /// <summary>
        /// Content of <paramref name="t"/> should be put here
        /// </summary>
        /// <param name="t">Content provider</param>
        /// <returns>Template placeholder for content</returns>
        public static SpecialString Content(this IProvidesContent t)
        {
            return t._("d.content(p);");
        }

        /// <summary>
        /// Content of <paramref name="t"/>'s for column <paramref name="columnName"/> should be put here
        /// </summary>
        /// <param name="t">Content provider</param>
        /// <param name="columnName">Column name to output content for</param>
        /// <returns>Template placeholder for content</returns>
        public static SpecialString Content(this IProvidesColumnContent t, string columnName)
        {
            return t._("d.content(p,'{0}');", columnName);
        }
    }


}
