using System;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.Editing
{
    public class CellValidationMessagesTemplateRegion : TemplateRegion
        , IModelProvider<IValidationMessagesViewModel>
    {
        public CellValidationMessagesTemplateRegion(string prefix, string id, ITemplatesScope scope)
            : base(TemplateRegionType.Custom, prefix, id, scope)
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IValidationMessagesViewModel
    {
        IJsArray<IValidationMessageViewModel> Messages { get; }

        bool IsRowEdit { get; }

        bool IsFormEdit { get; }
    }

    public interface IValidationMessageViewModel
    {
        string Code { get; }

        string Message { get; }
    }

    public interface ISpecialInvalidStateViewModel
    {
        [OverrideTplFieldName("renderedValidationMessages")]
        string ValidationMessages { get; }
    }


    public static class CellValidationMessagesTemplateExtensions
    {
        public static Inline WhenInvalid<T>(this CellEditorTemplateRegionBase<T> t, Action<SpecialVisualStateDescription<ISpecialInvalidStateViewModel>> state) where T : ICellEditorViewModel
        {
            return t.State("invalid", VisualState.FromSpecialDelegate(state));
        }

        public static CellValidationMessagesTemplateRegion Editor_ValidationMessages(this IViewPlugins t,
            string templateId = "cellValidationMessages")
        {
            return new CellValidationMessagesTemplateRegion(t.Model.Prefix, templateId, t.Scope);
        }

    }
}
