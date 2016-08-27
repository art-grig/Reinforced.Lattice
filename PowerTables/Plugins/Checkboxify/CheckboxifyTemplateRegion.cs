using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Plugins.Checkboxify
{
    public class CheckboxifySelectAllTemplateRegion : PluginTemplateRegion,
        IModelProvider<ICheckboxifySelectAll>, IProvidesTracking
    {
        

        public string ExistingModel { get; private set; }
        public bool IsTrackSet { get; set; }

        public CheckboxifySelectAllTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public interface ICheckboxifySelectAll
    {
        bool IsAllSelected { get; }
        bool CanSelectAll { get; }
    }

    public class CheckboxifiedCellTemplateRegion : PluginTemplateRegion, IModelProvider<ICheckboxifyCellViewModel>
    {
        

        public string ExistingModel { get; private set; }

        public CheckboxifiedCellTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public interface ICheckboxifyCellViewModel
    {
        object Value { get; }

        bool IsChecked { get; }

        bool CanCheck { get; }
    }

    public class CheckedRowTemplateRegion : PluginTemplateRegion,
        IProvidesTracking,
        IProvidesContent,
        IProvidesColumnContent
    {
        

        public bool IsTrackSet { get; set; }

        public CheckedRowTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    public static class CheckboxifyTemplateExtensions
    {
        public static CheckboxifySelectAllTemplateRegion CheckboxifySelectAll(this IViewPlugins t, string templateId = "checkboxifySelectAll")
        {
            return new CheckboxifySelectAllTemplateRegion(t,templateId);
        }

        public static CheckboxifiedCellTemplateRegion CheckboxifyCell(this IViewPlugins t, string templateId = "checkboxifyCell")
        {
            return new CheckboxifiedCellTemplateRegion(t,templateId);
        }

        public static CheckedRowTemplateRegion CheckboxifyRow(this IViewPlugins t, string templateId = "checkboxifyRow")
        {
            return new CheckedRowTemplateRegion(t,templateId);
        }

        public static MvcHtmlString BindSelectAll(this CheckboxifySelectAllTemplateRegion t, string eventId)
        {
            return t.BindEvent("selectAllEvent", eventId);
        }

        public static MvcHtmlString ThisWillTriggerSelection(this CheckboxifiedCellTemplateRegion t)
        {
            return MvcHtmlString.Create("data-checkboxify=\"true\"");
        }
    }
}
