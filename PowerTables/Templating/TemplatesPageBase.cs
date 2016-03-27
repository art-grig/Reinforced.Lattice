using System.Web.Mvc;

namespace PowerTables.Templating
{
    public abstract class TemplatesPageBase : WebViewPage<LatticeTemplatesViewModel>
    {
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
            return new PluignWrapperTemplateRegion(Model.Prefix,GetOutputWriter());
        }

        public ColumnParametrizedTemplateRegion HeaderWrapper()
        {
            return new ColumnParametrizedTemplateRegion(Model.Prefix, "headerWrapper",GetOutputWriter());
        }

        public FilterParametrizedTemplateRegion FilterWrapper()
        {
            return new FilterParametrizedTemplateRegion(Model.Prefix, "filterWrapper", GetOutputWriter());
        }

        
        public const string RowWrapper = "rowWrapper";

        public const string CellWrapper = "cellWrapper";
        
    }
}
