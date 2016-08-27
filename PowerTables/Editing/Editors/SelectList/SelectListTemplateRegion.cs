using System;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Editing.Editors.SelectList
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
            return t.State("selected", VisualState.FromSpecialDelegate(action));
        }
    }
}
