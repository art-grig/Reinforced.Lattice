using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.BuiltIn;

namespace PowerTables.Plugins.Checkboxify
{
    public class CheckboxifySelectAllTemplateRegion : PluginTemplateRegion,
        IModelProvider<ICheckboxifySelectAll>, IProvidesTracking
    {


        public string ExistingModel { get; private set; }
        public bool IsTrackSet { get; set; }

        public CheckboxifySelectAllTemplateRegion(IViewPlugins page, string id) : base(page, id, TemplateRegionType.Header)
        {
        }
    }

    public interface ICheckboxifySelectAll
    {
        bool IsAllSelected { get; }
        bool CanSelectAll { get; }
    }

    public class CheckboxifiedCellTemplateRegion : CellTemplateRegion<ICellModel>
    {
        public CheckboxifiedCellTemplateRegion(string prefix, string id, ITemplatesScope scope) : base(prefix, id, scope)
        {
        }
    }



    public static class CheckboxifyTemplateExtensions
    {
        public static CheckboxifySelectAllTemplateRegion CheckboxifySelectAll(this IViewPlugins t, string templateId = "checkboxifySelectAll")
        {
            return new CheckboxifySelectAllTemplateRegion(t, templateId);
        }

        public static CheckboxifiedCellTemplateRegion CheckboxifyCell(this IViewPlugins t, string templateId = "checkboxifyCell")
        {
            return new CheckboxifiedCellTemplateRegion(t.Scope.TemplatesPrefix, templateId, t.Scope);
        }

        public static SpecialString BindSelectAll(this CheckboxifySelectAllTemplateRegion t, string eventId)
        {
            return t.BindEvent("selectAllEvent", eventId);
        }

        public static SpecialString ThisWillTriggerSelection(this CheckboxifiedCellTemplateRegion t)
        {
            return t._("w('data-checkboxify=\"true\"');");
        }
    }
}
