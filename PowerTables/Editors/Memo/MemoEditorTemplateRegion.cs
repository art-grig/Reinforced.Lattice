﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Editors.Memo
{
    public class MemoEditorTemplateRegion : CellEditorTemplateRegionBase<IMemoEditorViewModel>
    {
        public MemoEditorTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public interface IMemoEditorViewModel : ICellEditorViewModel
    {
        int MaxChars { get; set; }

        int WarningChars { get; set; }

        int Rows { get; set; }

        int Columns { get; set; }
    }

    public interface ISpecialWarningStateViewModel
    {
        int CurrentChars { get; set; }
        int WarningChars { get; set; }
        int MaxChars { get; set; }
    }

    public static class MemoEditorTemplateExtensions
    {
        public static MemoEditorTemplateRegion Editor_Memo(this IViewPlugins t, string templateId = "memoEditor")
        {
            return new MemoEditorTemplateRegion(t, templateId);
        }

        public static MvcHtmlString ThisIsInput(this MemoEditorTemplateRegion t)
        {
            return t.Mark("TextArea");
        }

        public static MvcHtmlString WhenLengthWarning<T>(this MemoEditorTemplateRegion t, Action<SpecialVisualStateDescription<ISpecialWarningStateViewModel>> state) where T : IMemoEditorViewModel
        {
            return t.State("warning", VisualState.FromSpecialDelegate(state));
        }
    }
}
