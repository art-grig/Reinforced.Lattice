using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Editors.PlainText
{
    public class PlainTextEditorTemplateRegion : CellEditorTemplateRegionBase<IPlainTextEditorViewModel>
    {
        public PlainTextEditorTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public interface IPlainTextEditorViewModel : ICellEditorViewModel
    {
        
    }

    public static class PlainTextEditorTemplateExtensions
    {
        public static MvcHtmlString ThisIsInput(this PlainTextEditorTemplateRegion t)
        {
            return t.Mark("Input");
        }

        public static PlainTextEditorTemplateRegion Editor_PlainText(this IViewPlugins t, string templateId = "plainTextEditor")
        {
            return new PlainTextEditorTemplateRegion(t,templateId);
        }
    }
}
