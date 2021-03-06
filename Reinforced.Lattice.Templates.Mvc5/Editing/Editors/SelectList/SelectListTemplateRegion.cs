﻿using System;
using System.Web.Mvc;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.Editing.Editors.SelectList
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
        IJsArray<UiListItem> Items { get; }

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

        public static Inline ThisIsList(this SelectListTemplateRegion t)
        {
            return t.Mark("List");
        }

        public static Inline WhenSelected(this SelectListTemplateRegion t, Action<SpecialVisualStateDescription<ISelectedStateViewModel>> action)
        {
            return t.State("selected", VisualState.FromSpecialDelegate(action));
        }
    }
}
