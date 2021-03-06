﻿using System;
using Reinforced.Lattice.Templates.BuiltIn;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.Editing
{
    public class CellEditorTemplateRegionBase<T> : PluginTemplateRegion, 
        IProvidesVisualState, 
        IProvidesDatepicker,
        IModelProvider<T>
    {
        public CellEditorTemplateRegionBase(IViewPlugins page, string id) : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface ICellEditorViewModel : ICellModel
    {
        bool IsRowEdit { get; }

        bool IsFormEdit { get; }
        
        bool IsCellEdit { get; }

        bool CanComplete { get; }

        [OverrideTplFieldName("OriginalContent(p)")]
        object OriginalContent { get; }
    }

    public interface ICellEditorViewModel<T> : ICellModel<T>
    {
        bool IsRowEdit { get; }

        bool IsFormEdit { get; }

        bool IsCellEdit { get; }

        bool CanComplete { get; }

        [OverrideTplFieldName("OriginalContent(p)")]
        object OriginalContent { get; }
    }

    
    public static class CellEditorTemplateRegionBaseExtensions
    {
       

        public static Inline WhenSaving<T>(this CellEditorTemplateRegionBase<T> t, Action<VisualState> state) where T : ICellEditorViewModel
        {
            return t.State("saving", state);
        }

        public static Inline WhenValidating<T>(this CellEditorTemplateRegionBase<T> t, Action<VisualState> state) where T : ICellEditorViewModel
        {
            return t.State("validating", state);
        }

        public static Inline Datepicker<T>(this CellEditorTemplateRegionBase<T> t) where T : ICellEditorViewModel
        {
            return t.DatepickerIf(t.Property(c => c.Column.IsDateTime), t.Property(c => c.Column.Configuration.IsNullable));
        }

        public static Inline BindChanged<T>(this CellEditorTemplateRegionBase<T> t,string eventId) where T : ICellEditorViewModel
        {
            return t.BindEvent("changedHandler", eventId);
        }

        public static Inline BindCommit<T>(this CellEditorTemplateRegionBase<T> t, string eventId) where T : ICellEditorViewModel
        {
            return t.BindEvent("commitHandler", eventId);
        }

        public static Inline BindReject<T>(this CellEditorTemplateRegionBase<T> t, string eventId) where T : ICellEditorViewModel
        {
            return t.BindEvent("rejectHandler", eventId);
        }

        public static Inline OriginalContent<T>(this CellEditorTemplateRegionBase<T> t) where T : ICellEditorViewModel
        {
            return t.Raw("o.OriginalContent(p);");
        }
    }
}
