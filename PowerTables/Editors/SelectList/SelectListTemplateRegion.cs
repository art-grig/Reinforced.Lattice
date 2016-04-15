using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Editors.SelectList
{
    public class SelectListTemplateRegion : CellEditorTemplateRegionBase<ISelectListEditorViewModel>
    {
        public SelectListTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public interface ISelectListEditorViewModel : ICellEditorViewModel
    {
        IHbArray<SelectListItem> Items { get; }

        string SelectedText { get; set; }

        string SelectedValue { get; set; }
    }

    public interface ISelectedStateViewModel
    {
        SelectListItem SelectedItem { get; }
    }

    public static class SelectListEditorTemplateExtensions
    {
        public static SelectListTemplateRegion Editor_SelectList(this IViewPlugins t, string templateId = "selectListEditor")
        {
            return new SelectListTemplateRegion(t, templateId);
        }

        public static MvcHtmlString ThisIsList(this SelectListTemplateRegion t)
        {
            return t.Mark("List");
        }

        public static MvcHtmlString WhenSelected(this SelectListTemplateRegion t, Action<SpecialVisualStateDescription<ISelectedStateViewModel>> action)
        {
            var state = new VisualState();
            var special = state.Special<ISelectedStateViewModel>();
            action(special);
            return t.State("selected", state);
        }
    }
}
