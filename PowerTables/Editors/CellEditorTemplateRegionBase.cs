using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Editors
{
    public class CellEditorTemplateRegionBase<T> : PluginTemplateRegion, 
        IProvidesVisualState, 
        IProvidesDatepicker,
        IModelProvider<T> where T:ICellEditorViewModel
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

        bool CanComplete { get; }
    }

    public static class CellEditorTemplateRegionBaseExtensions
    {
        public static MvcHtmlString WhenInvalid<T>(this CellEditorTemplateRegionBase<T> t, Action<VisualState> state) where T : ICellEditorViewModel
        {
            return t.State("invalid", state);
        }

        public static MvcHtmlString WhenSaving<T>(this CellEditorTemplateRegionBase<T> t, Action<VisualState> state) where T : ICellEditorViewModel
        {
            return t.State("saving", state);
        }

        public static MvcHtmlString WhenValidating<T>(this CellEditorTemplateRegionBase<T> t, Action<VisualState> state) where T : ICellEditorViewModel
        {
            return t.State("validating", state);
        }

        public static MvcHtmlString Datepicker<T>(this CellEditorTemplateRegionBase<T> t) where T : ICellEditorViewModel
        {
            return t.Datepicker(t.CleanValue(c => c.Column.RawName));
        }

        public static MvcHtmlString BindChanged<T>(this CellEditorTemplateRegionBase<T> t,string eventId) where T : ICellEditorViewModel
        {
            return t.BindEvent("changedHandler", eventId);
        }

        public static MvcHtmlString BindCommit<T>(this CellEditorTemplateRegionBase<T> t, string eventId) where T : ICellEditorViewModel
        {
            return t.BindEvent("commitHandler", eventId);
        }

        public static MvcHtmlString BindReject<T>(this CellEditorTemplateRegionBase<T> t, string eventId) where T : ICellEditorViewModel
        {
            return t.BindEvent("rejectHandler", eventId);
        }
    }
}
