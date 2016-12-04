using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Plugins.Hideout
{
    public class HideoutTemplateRegion : PluginTemplateRegion,
        IModelProvider<IHideoutViewModel>
    {
        public string ExistingModel { get; private set; }

        public HideoutTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    /// <summary>
    /// ViewModel for Hideout menu
    /// </summary>
    public interface IHideoutViewModel
    {
        /// <summary>
        /// Configuration
        /// </summary>
        HideoutPluginConfiguration Configuration { get; }

        /// <summary>
        /// Set of Hideout column states
        /// </summary>
        IHbArray<IHideoutColumnState> ColumnStates { get; }

    }

    /// <summary>
    /// ViewModel for Hideout column state
    /// </summary>
    public interface IHideoutColumnState
    {
        /// <summary>
        /// Is column currently visible
        /// </summary>
        bool Visible { get; }
        
        /// <summary>
        /// Raw column name
        /// </summary>
        string RawName { get; }

        /// <summary>
        /// Column title
        /// </summary>
        string Name { get; }

        /// <summary>
        /// Is column not drawn (not hidden)
        /// </summary>
        bool DoesNotExists { get; }
    }

    public static class HideoutTemplateExtensions
    {
        public static HideoutTemplateRegion HideoutMenu(this IViewPlugins t, string templateId = "hideout")
        {
            return new HideoutTemplateRegion(t, templateId);
        }

        /// <summary>
        /// Specified event on mentioned HTML element will hide corresponding column
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="eventId">DOM event id</param>
        /// <returns></returns>
        public static MvcHtmlString BindHide<T>(this T t, string eventId)
            where T : IModelProvider<IHideoutColumnState>, IProvidesEventsBinding
        {
            return t.BindEvent("hideColumn", eventId, t.Property(c => c.RawName));
        }

        /// <summary>
        /// Specified event on mentioned HTML element will show corresponding column
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="eventId">DOM event id</param>
        /// <returns></returns>
        public static MvcHtmlString BindShow<T>(this T t, string eventId)
            where T : IModelProvider<IHideoutColumnState>, IProvidesEventsBinding
        {
            return t.BindEvent("showColumn", eventId, t.Property(c => c.RawName));
        }

        /// <summary>
        /// Specified event on mentioned HTML element will toggle visibility of corresponding column
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="eventId">DOM event id</param>
        /// <returns></returns>
        public static MvcHtmlString BindToggle<T>(this T t, string eventId)
            where T : IModelProvider<IHideoutColumnState>, IProvidesEventsBinding
        {
            return t.BindEvent("toggleColumn", eventId, t.Property(c => c.RawName));
        }

        /// <summary>
        /// Specified event on mentioned HTML element will hide corresponding column
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="eventId">DOM event id</param>
        /// <param name="columnName">Column name to hide</param>
        /// <returns></returns>
        public static MvcHtmlString BindHide<T>(this T t, string eventId,string columnName)
            where T : IModelProvider<IHideoutViewModel>, IProvidesEventsBinding
        {
            return t.BindEvent("hideColumn", eventId, string.Format("\"{0}\"", columnName));
        }

        /// <summary>
        /// Specified event on mentioned HTML element will show corresponding column
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="eventId">DOM event id</param>
        /// <param name="columnName">Column name to show</param>
        /// <returns></returns>
        public static MvcHtmlString BindShow<T>(this T t, string eventId, string columnName)
            where T : IModelProvider<IHideoutViewModel>, IProvidesEventsBinding
        {
            return t.BindEvent("showColumn", eventId, string.Format("\"{0}\"", columnName));
        }

        /// <summary>
        /// Specified event on mentioned HTML element will toggle visibility of corresponding column
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="t"></param>
        /// <param name="eventId">DOM event id</param>
        /// <param name="columnName">Column name to toggle</param>
        /// <returns></returns>
        public static MvcHtmlString BindToggle<T>(this T t, string eventId, string columnName)
            where T : IModelProvider<IHideoutViewModel>, IProvidesEventsBinding
        {
            return t.BindEvent("toggleColumn", eventId, string.Format("\"{0}\"", columnName));
        }

        /// <summary>
        /// Specifies template in case if specified hideout column is visible
        /// </summary>
        /// <param name="t"></param>
        /// <param name="columnName">Column name</param>
        /// <returns></returns>
        public static HbTagRegion IfColumnVisible(this IModelProvider<IHideoutViewModel> t, string columnName)
        {
            return new HbTagRegion("ifColVisible",string.Format("\"{0}\"",columnName),t.Writer);
        }
    }
}
