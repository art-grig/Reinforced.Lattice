using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Plugins.Toolbar;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Templating.BuiltIn
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

        IHbArray<TRow> Selection { get; set; }
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

        public static MvcHtmlString BindDismiss<TConfirmation>(this  IConfirmationWindow<TConfirmation> p, string eventId)
        {
            return p.BindEvent("dismiss", eventId);
        }

        public static MvcHtmlString BindConfirm<TConfirmation>(this  IConfirmationWindow<TConfirmation> p, string eventId)
        {
            return p.BindEvent("confirm", eventId);
        }

        public static MvcHtmlString Editors<TConfirmation>(this  IConfirmationWindow<TConfirmation> p)
        {
            return MvcHtmlString.Create("{{{ Editors }}}");
        }

        public static MvcHtmlString EditorFor<TConfirmation, TData>(this  IConfirmationWindow<TConfirmation> p, Expression<Func<TConfirmation, TData>> field)
        {
            var name = LambdaHelpers.ParsePropertyLambda(field).Name;
            return EditorFor(p, name);
        }

        public static MvcHtmlString EditorFor<TConfirmation>(this IConfirmationWindow<TConfirmation> p, string fieldName)
        {
            return MvcHtmlString.Create(string.Format("{{{{{{Editor \"{0}\"}}}}}}", fieldName));
        }

        public static MvcHtmlString ThisIsContentContainer<TConfirmation>(this IConfirmationWindow<TConfirmation> p)
        {
            return p.Mark("ContentPlaceholder");
        }

        public static MvcHtmlString ThisIsDetailsContainer<TConfirmation>(this IConfirmationWindow<TConfirmation> p)
        {
            return p.Mark("DetailsPlaceholder");
        }

        public static MvcHtmlString TemplatePiece<TConfirmation>(this IConfirmationWindow<TConfirmation> p, string pieceName)
        {
            return MvcHtmlString.Create("{{{TemplatePieces[" + pieceName + "]}}}");
        }

        public static MvcHtmlString WhenContentLoading<TConfirmation>(this IConfirmationWindow<TConfirmation> t, Action<VisualState> state)
        {
            return t.State("contentLoading", state);
        }

        public static MvcHtmlString WhenDetailsLoading<TConfirmation>(this IConfirmationWindow<TConfirmation> t, Action<VisualState> state)
        {
            return t.State("detailsLoading", state);
        }
    }
}
