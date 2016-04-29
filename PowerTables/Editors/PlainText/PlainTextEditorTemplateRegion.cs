using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

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
            return MvcHtmlString.Create(t.Mark("Input") + " " + t.Datepicker(t.CleanValue(c=>c.Column.RawName)));
        }

        public static PlainTextEditorTemplateRegion Editor_PlainText(this IViewPlugins t, string templateId = "plainTextEditor")
        {
            return new PlainTextEditorTemplateRegion(t,templateId);
        }
    }
}
