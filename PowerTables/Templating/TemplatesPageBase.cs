using System.IO;
using System.Web.Mvc;
using PowerTables.Templating.BuiltIn;

namespace PowerTables.Templating
{
    public abstract class TemplatesPageBase : WebViewPage<LatticeTemplatesViewModel>
    {
        /// <summary>
        /// Default templates view. Used for shortening .RenderTemplates calls
        /// </summary>
        public static string DefaultTemplatesView;

        public override void InitHelpers()
        {
            base.InitHelpers();
            Plugin = new PluginsClassifier(GetOutputWriter(), Model);
        }

        /// <summary>
        /// Declares raw template region
        /// </summary>
        /// <param name="id">Template id</param>
        /// <returns>template region</returns>
        public TemplateRegion Template(string id)
        {
            return new TemplateRegion(Model.Prefix, id, this.GetOutputWriter());
        }

        /// <summary>
        /// Templates for particular plugins
        /// </summary>
        public IViewPlugins Plugin { get; private set; }

        private class PluginsClassifier : IViewPlugins
        {
            public PluginsClassifier(TextWriter writer, LatticeTemplatesViewModel model)
            {
                Writer = writer;
                Model = model;
            }

            public TextWriter Writer { get; private set; }
            public LatticeTemplatesViewModel Model { get; private set; }
        }

    }


}
