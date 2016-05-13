using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Toolbar
{
    public class ConfirmationTemplateRegion<T, TForm> : PluginTemplateRegion, IModelProvider<IConfirmationWindowViewModel<T>>,
        IProvidesDatepicker
    {
        public ConfirmationTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IConfirmationWindowViewModel
    {

        IHbArray<string> SelectedItems { get; }
    }

    public interface IConfirmationWindowViewModel<T> : IConfirmationWindowViewModel
    {
        IHbArray<T> SelectedObjects { get; }
    }

    public static class ConfirmationWindowTemplateExtensions
    {
        public static ConfirmationTemplateRegion<object, object> Toolbar_ConfirmationWindow(this IViewPlugins p, string templateId)
        {
            return new ConfirmationTemplateRegion<object, object>(p, templateId);
        }

        public static ConfirmationTemplateRegion<TRow, object> Toolbar_ConfirmationWindow<TRow>(this IViewPlugins p, string templateId)
        {
            return new ConfirmationTemplateRegion<TRow, object>(p, templateId);
        }

        public static ConfirmationTemplateRegion<TRow, TForm> Toolbar_ConfirmationWindow<TRow, TForm>(this IViewPlugins p, string templateId)
        {
            return new ConfirmationTemplateRegion<TRow, TForm>(p, templateId);
        }

        public static MvcHtmlString BindDismiss<TRow, TForm>(this  ConfirmationTemplateRegion<TRow, TForm> p, string eventId)
        {
            return p.BindEvent("dismissHandle", eventId);
        }

        public static MvcHtmlString BindConfirm<TRow, TForm>(this  ConfirmationTemplateRegion<TRow, TForm> p, string eventId)
        {
            return p.BindEvent("confirmHandle", eventId);
        }
    }
}
