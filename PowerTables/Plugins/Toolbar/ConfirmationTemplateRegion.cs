using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Toolbar
{
    /// <summary>
    /// Template region for confirmation of command being perfermed by button click
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <typeparam name="TForm"></typeparam>
    public class ConfirmationTemplateRegion<T, TForm> : PluginTemplateRegion, IModelProvider<IConfirmationWindowViewModel<T>>,
        IProvidesDatepicker
    {
        /// <summary>
        /// Default constructor
        /// </summary>
        /// <param name="page"></param>
        /// <param name="id"></param>
        public ConfirmationTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
    }

    /// <summary>
    /// Nongeneric View model for action confirmation template
    /// </summary>
    public interface IConfirmationWindowViewModel
    {
        /// <summary>
        /// Set of selected items' key columns
        /// </summary>
        IHbArray<string> SelectedItems { get; }
    }

    /// <summary>
    /// View model for action confirmation template
    /// </summary>
    /// <typeparam name="T">Table's row type</typeparam>
    public interface IConfirmationWindowViewModel<T> : IConfirmationWindowViewModel
    {
        /// <summary>
        /// Gets table rows being selected with checkboxify plugin attached to table
        /// </summary>
        IHbArray<T> SelectedObjects { get; }
    }

    /// <summary>
    /// Extension methods for button's confirmation window templates
    /// </summary>
    public static class ConfirmationWindowTemplateExtensions
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="p"></param>
        /// <param name="templateId"></param>
        /// <returns></returns>
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
            return p.BindEvent("dismiss", eventId);
        }

        public static MvcHtmlString BindConfirm<TRow, TForm>(this  ConfirmationTemplateRegion<TRow, TForm> p, string eventId)
        {
            return p.BindEvent("confirm", eventId);
        }
    }
}
