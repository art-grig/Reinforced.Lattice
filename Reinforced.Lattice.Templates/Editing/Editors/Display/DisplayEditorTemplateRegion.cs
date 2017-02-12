using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates.Editing.Editors.Display
{
    public class DisplayEditorTemplateRegion<T> : CellEditorTemplateRegionBase<ICellEditorViewModel<T>>
    {
        public DisplayEditorTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }


    public static class DisplayEditorTemplateExtensions
    {
        /// <summary>
        /// Declares UI template for checkbox editor
        /// </summary>
        /// <param name="t">Plugin</param>
        /// <param name="templateId">Template ID override</param>
        /// <returns></returns>
        public static DisplayEditorTemplateRegion<T> Editor_Display<T>(this IViewPlugins t, string templateId = "displayEditor")
        {
            return new DisplayEditorTemplateRegion<T>(t, templateId);
        }

        /// <summary>
        /// Declares UI template for checkbox editor
        /// </summary>
        /// <param name="t">Plugin</param>
        /// <param name="templateId">Template ID override</param>
        /// <returns></returns>
        public static DisplayEditorTemplateRegion<object> Editor_Display(this IViewPlugins t, string templateId = "displayEditor")
        {
            return new DisplayEditorTemplateRegion<object>(t, templateId);
        }


        public static SpecialString Render<T>(this DisplayEditorTemplateRegion<T> c)
        {
            return c.Raw("o.Render(p);");
        }

        public static SpecialString ThisIsContentParent<T>(this DisplayEditorTemplateRegion<T> c)
        {
            return c.Mark("ContentElement");
        }
    }
    
    
}
