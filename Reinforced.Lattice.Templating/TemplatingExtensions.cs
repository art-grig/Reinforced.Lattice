using System.Web.Mvc;
using System.Web.Mvc.Html;
using JetBrains.Annotations;
using Reinforced.Lattice.Templates.Compilation;

// ReSharper disable InconsistentNaming

namespace Reinforced.Lattice.Templates
{
    /// <summary>
    /// Helper extensions for rendering
    /// </summary>
    public static class TemplatingExtensions
    {
        /// <summary>
        /// Helper for rendering templates
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="pathToTemplates">Path to templates that should be used</param>
        /// <param name="prefix">Templates prefix</param>
        public static void RenderTemplates(this HtmlHelper helper, string prefix, [AspMvcView] string pathToTemplates)
        {
            helper.RenderPartial(pathToTemplates, new LatticeTemplatesViewModel() { Prefix = prefix });
        }

        /// <summary>
        /// Helper for rendering templates
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="prefix"></param>
        public static void RenderDefaultTemplates(this HtmlHelper helper, string prefix = "lt")
        {
            RenderTemplates(helper, prefix, TemplatesPageBase.DefaultTemplatesView);
        }


        /// <summary>
        /// Begins region containing additional Lattice templates
        /// </summary>
        /// <param name="page">Web page where you want to begin additional templates region</param>
        /// <param name="templatesPrefix">Templates prefix for </param>
        /// <returns></returns>
        public static AdditionalTemplatesScope LatticeAdditionalTemplates(this WebViewPage page, string templatesPrefix = "lt",bool renderScriptTag = true)
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
