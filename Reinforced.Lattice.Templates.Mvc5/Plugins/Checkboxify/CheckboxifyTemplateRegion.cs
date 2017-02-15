using Reinforced.Lattice.Templates.BuiltIn;
using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates.Plugins.Checkboxify
{
    public class CheckboxifySelectAllTemplateRegion : PluginTemplateRegion,
        IModelProvider<ICheckboxifySelectAll>
    {
        public string ExistingModel { get; private set; }

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

        public static Inline BindSelectAll(this CheckboxifySelectAllTemplateRegion t, string eventId)
        {
            return t.BindEvent("selectAllEvent", eventId);
        }

        public static Inline ThisWillTriggerSelection(this CheckboxifiedCellTemplateRegion t)
        {
            return t._("w('data-checkboxify=\"true\"');");
        }
    }
}
