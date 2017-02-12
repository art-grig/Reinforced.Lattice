using System;
using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates.Editing.Editors.Check
{
    /// <summary>
    /// Template region for checkbox editor
    /// </summary>
    public class CheckEditorTemplateRegion : CellEditorTemplateRegionBase<ICheckedEditorViewModel>
    {
        /// <summary>
        /// Default template region constructor
        /// </summary>
        public CheckEditorTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }
    }

    /// <summary>
    /// Viewmodel for checkbox editor
    /// </summary>
    public interface ICheckedEditorViewModel : ICellEditorViewModel
    {
        
    }

    /// <summary>
    /// Templating extensions for checkbox editor
    /// </summary>
    public static class CheckEditorTemplateExtensions
    {
        /// <summary>
        /// Declares UI template for checkbox editor
        /// </summary>
        /// <param name="t">Plugin</param>
        /// <param name="templateId">Template ID override</param>
        /// <returns></returns>
        public static CheckEditorTemplateRegion Editor_Check(this IViewPlugins t, string templateId = "checkEditor")
        {
            return new CheckEditorTemplateRegion(t,templateId);
        }

        /// <summary>
        /// Specifies visual state when boolean value lying behind check editor is true and/or when user checked checkbox
        /// </summary>
        /// <param name="t"></param>
        /// <param name="state">Visual state builder. See <see cref="VisualState"/> class for details</param>
        /// <returns></returns>
        public static SpecialString WhenChecked(this CheckEditorTemplateRegion t, Action<VisualState> state)
        {
            return t.State("checked", state);
        }

        public static SpecialString FocusElement(this CheckEditorTemplateRegion t)
        {
            return t.Mark("FocusElement");
        }
    }
}
