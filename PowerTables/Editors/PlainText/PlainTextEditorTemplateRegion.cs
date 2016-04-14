using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Editors.PlainText
{
    public class PlainTextEditorTemplateRegion : CellEditorTemplateRegionBase<IPlainTextEditorViewModel>
    {
        public PlainTextEditorTemplateRegion(IViewPlugins page) : base(page, "plainTextEditor")
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

        public static PlainTextEditorTemplateRegion Editor_PlainText(this IViewPlugins t)
        {
            return new PlainTextEditorTemplateRegion(t);
        }
    }
}
