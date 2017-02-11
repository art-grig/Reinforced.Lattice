using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Compilation;

namespace PowerTables.Editing.Editors.PlainText
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
        public static SpecialString ThisIsInput(this PlainTextEditorTemplateRegion t)
        {
            return t._(t.Mark("Input") + " " + t.Datepicker());
        }

        public static PlainTextEditorTemplateRegion Editor_PlainText(this IViewPlugins t, string templateId = "plainTextEditor")
        {
            return new PlainTextEditorTemplateRegion(t,templateId);
        }
    }
}
