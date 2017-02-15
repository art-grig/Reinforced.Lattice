using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.BuiltIn
{
    public class CommandConfirmationTemplateRegion<TRow, TConfirmation> : PluginTemplateRegion, IModelProvider<IConfirmationViewModel<TRow, TConfirmation>>,
        IProvidesDatepicker, IProvidesVisualState, IConfirmationWindow<TConfirmation>
    {
        public CommandConfirmationTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IConfirmationViewModel<TRow, TConfirmation>
    {
        Dictionary<string, string> TemplatePieces { get; }

        TRow Subject { get; set; }

        IJsArray<TRow> Selection { get; set; }
    }

    public interface IConfirmationWindow<TConfirmation> : IProvidesEventsBinding, IProvidesMarking, IProvidesVisualState
    {

    }

    public static class ConfirmationTemplateRegionExtensions
    {
        public static CommandConfirmationTemplateRegion<object, object> Confirmation(this IViewPlugins p, string templateId)
        {
            return new CommandConfirmationTemplateRegion<object, object>(p, templateId);
        }

        public static CommandConfirmationTemplateRegion<TRow, object> Confirmation<TRow>(this IViewPlugins p, string templateId)
        {
            return new CommandConfirmationTemplateRegion<TRow, object>(p, templateId);
        }

        public static CommandConfirmationTemplateRegion<TRow, TConfirmation> Confirmation<TRow, TConfirmation>(this IViewPlugins p, string templateId)
        {
            return new CommandConfirmationTemplateRegion<TRow, TConfirmation>(p, templateId);
        }

        public static Inline BindDismiss<TConfirmation>(this  IConfirmationWindow<TConfirmation> p, string eventId)
        {
            return p.BindEvent("dismiss", eventId);
        }

        public static Inline BindConfirm<TConfirmation>(this  IConfirmationWindow<TConfirmation> p, string eventId)
        {
            return p.BindEvent("confirm", eventId);
        }

        public static Inline Editors<TConfirmation>(this  IConfirmationWindow<TConfirmation> p)
        {
            return p._("o.Editors(p);");
        }

        public static Inline EditorFor<TConfirmation, TData>(this  IConfirmationWindow<TConfirmation> p, Expression<Func<TConfirmation, TData>> field)
        {
            var name = LambdaHelpers.ParsePropertyLambda(field).Name;
            return EditorFor(p, name);
        }

        public static Inline EditorFor<TConfirmation>(this IConfirmationWindow<TConfirmation> p, string fieldName)
        {
            return p._("o.Editor(p,'{0}');", fieldName);
        }

        public static Inline ThisIsContentContainer<TConfirmation>(this IConfirmationWindow<TConfirmation> p)
        {
            return p.Mark("ContentPlaceholder");
        }

        public static Inline ThisIsDetailsContainer<TConfirmation>(this IConfirmationWindow<TConfirmation> p)
        {
            return p.Mark("DetailsPlaceholder");
        }

        public static Inline TemplatePiece<TConfirmation>(this IConfirmationWindow<TConfirmation> p, string pieceName)
        {
            return p._("w(o.TemplatePieces['{0}']);", pieceName);
        }

        public static Inline WhenContentLoading<TConfirmation>(this IConfirmationWindow<TConfirmation> t, Action<VisualState> state)
        {
            return t.State("contentLoading", state);
        }

        public static Inline WhenDetailsLoading<TConfirmation>(this IConfirmationWindow<TConfirmation> t, Action<VisualState> state)
        {
            return t.State("detailsLoading", state);
        }
    }
}
