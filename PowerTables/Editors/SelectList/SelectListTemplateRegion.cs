﻿using System;
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
        public SelectListTemplateRegion(IViewPlugins page) : base(page, "selectListEditor")
        {
        }
    }

    public interface ISelectListEditorViewModel: ICellEditorViewModel
    {
        IHbArray<SelectListItem> Items { get; }
    }

    public static class SelectListEditorTemplateExtensions
    {
        public static SelectListTemplateRegion Editor_SelectList(this IViewPlugins t)
        {
            return new SelectListTemplateRegion(t);
        }

        public static MvcHtmlString ThisIsList(this SelectListTemplateRegion t)
        {
            return t.Mark("List");
        }
    }
}
