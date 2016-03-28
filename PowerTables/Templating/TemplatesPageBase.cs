using System.IO;
using System.Web.Mvc;

namespace PowerTables.Templating
{
    public abstract class TemplatesPageBase : WebViewPage<LatticeTemplatesViewModel>
    {
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
        /// Declares template region for table layout
        /// </summary>
        /// <returns>Template region</returns>
        public LayoutTemplateRegion Layout()
        {
            return new LayoutTemplateRegion(Model.Prefix, GetOutputWriter());
        }

        /// <summary>
        /// Declares template region for plugin wrapper
        /// </summary>
        /// <returns></returns>
        public PluignWrapperTemplateRegion PluginWrapper()
        {
            return new PluignWrapperTemplateRegion(Model.Prefix, GetOutputWriter());
        }

        public ColumnParametrizedTemplateRegion HeaderWrapper()
        {
            return new ColumnParametrizedTemplateRegion(Model.Prefix, "headerWrapper", GetOutputWriter());
        }

        public FilterParametrizedTemplateRegion FilterWrapper()
        {
            return new FilterParametrizedTemplateRegion(Model.Prefix, "filterWrapper", GetOutputWriter());
        }

        public TemplateRegion RowWrapper()
        {
            return new TemplateRegion(Model.Prefix, "rowWrapper",GetOutputWriter());
        }
        
        public const string CellWrapper = "cellWrapper";

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
