using System.Web.Mvc;
using PowerTables.Templating;

namespace PowerTables.Plugins.RowAction
{
    public class RowActionTemplateRegion<T, TForm> : PluginTemplateRegion, IModelProvider<IRowActionWindowViewModel<T>>,
        IProvidesDatepicker
    {
        /// <summary>
        /// Default constructor
        /// </summary>
        /// <param name="page"></param>
        /// <param name="id"></param>
        public RowActionTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
    }


    /// <summary>
    /// View model for action confirmation template
    /// </summary>
    /// <typeparam name="T">Table's row type</typeparam>
    public interface IRowActionWindowViewModel<T>
    {
        /// <summary>
        /// Gets walue wheter action confirmation window is loading data from server
        /// </summary>
        bool IsLoading { get; }

        /// <summary>
        /// Gets table row instance being selected with checkboxify plugin attached to table
        /// </summary>
        T Row { get; }
    }

    /// <summary>
    /// Extension methods for button's confirmation window templates
    /// </summary>
    public static class RowActionWindowTemplateExtensions
    {
        public static RowActionTemplateRegion<object, object> RowAction_ConfirmationWindow(this IViewPlugins p, string templateId)
        {
            return new RowActionTemplateRegion<object, object>(p, templateId);
        }

        public static RowActionTemplateRegion<TRow, object> RowAction_ConfirmationWindow<TRow>(this IViewPlugins p, string templateId)
        {
            return new RowActionTemplateRegion<TRow, object>(p, templateId);
        }

        public static RowActionTemplateRegion<TRow, TForm> RowAction_ConfirmationWindow<TRow, TForm>(this IViewPlugins p, string templateId)
        {
            return new RowActionTemplateRegion<TRow, TForm>(p, templateId);
        }

        public static MvcHtmlString BindDismiss<TRow, TForm>(this  RowActionTemplateRegion<TRow, TForm> p, string eventId)
        {
            return p.BindEvent("dismiss", eventId);
        }

        public static MvcHtmlString BindConfirm<TRow, TForm>(this  RowActionTemplateRegion<TRow, TForm> p, string eventId)
        {
            return p.BindEvent("confirm", eventId);
        }
    }
}
