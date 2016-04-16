using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Editors.Check
{
    public class CheckEditorTemplateRegion : CellEditorTemplateRegionBase<ICheckedEditorViewModel>
    {
        public CheckEditorTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public interface ICheckedEditorViewModel : ICellEditorViewModel
    {
        
    }

    public static class CheckEditorTemplateExtensions
    {
        public static CheckEditorTemplateRegion Editor_Check(this IViewPlugins t, string templateId = "checkEditor")
        {
            return new CheckEditorTemplateRegion(t,templateId);
        }

        public static MvcHtmlString WhenChecked(this CheckEditorTemplateRegion t, Action<VisualState> state)
        {
            return t.State("checked", state);
        }
    }
}
