using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Plugins.Checkboxify
{
    public class CheckboxifySelectAllTemplateRegion : PluginTemplateRegion,
        IModelProvider<ICheckboxifySelectAll>, IProvidesTracking
    {
        public CheckboxifySelectAllTemplateRegion(IViewPlugins page)
            : base(page, "checkboxifySelectAll")
        {
        }

        public string ExistingModel { get; private set; }
        public bool IsTrackSet { get; set; }
    }

    public interface ICheckboxifySelectAll
    {
        bool IsAllSelected { get; }
        bool CanSelectAll { get; }
    }

    public class CheckboxifiedCellTemplateRegion : PluginTemplateRegion, IModelProvider<ICheckboxifyCellViewModel>
    {
        public CheckboxifiedCellTemplateRegion(IViewPlugins page)
            : base(page, "checkboxifyCell")
        {
        }

        public string ExistingModel { get; private set; }
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
        public CheckedRowTemplateRegion(IViewPlugins page)
            : base(page, "checkboxifyRow")
        {
        }

        public bool IsTrackSet { get; set; }
    }

    public static class CheckboxifyTemplateExtensions
    {
        public static CheckboxifySelectAllTemplateRegion CheckboxifySelectAll(this IViewPlugins t)
        {
            return new CheckboxifySelectAllTemplateRegion(t);
        }

        public static CheckboxifiedCellTemplateRegion CheckboxifyCell(this IViewPlugins t)
        {
            return new CheckboxifiedCellTemplateRegion(t);
        }

        public static CheckedRowTemplateRegion CheckboxifyRow(this IViewPlugins t)
        {
            return new CheckedRowTemplateRegion(t);
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
