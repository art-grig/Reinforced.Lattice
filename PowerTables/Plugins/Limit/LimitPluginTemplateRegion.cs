using System.Web.Mvc;
using PowerTables.Templating;
using PowerTables.Templating.Compilation;
using PowerTables.Templating.Expressions;

namespace PowerTables.Plugins.Limit
{
    public class LimitPluginTemplateRegion : PluginTemplateRegion
        , IModelProvider<ILimitPluginViewModel>
    {


        public string ExistingModel { get; private set; }

        public LimitPluginTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    /// <summary>
    /// Limit plugin viewmodel
    /// </summary>
    public interface ILimitPluginViewModel
    {
        /// <summary>
        /// Currently selected value
        /// </summary>
        ILimitSize SelectedValue { get; }

        /// <summary>
        /// All available sizes
        /// </summary>
        IJsArray<ILimitSize> Sizes { get; }
    }

    /// <summary>
    /// Sizes list item
    /// </summary>
    public interface ILimitSize
    {
        /// <summary>
        /// Is current item separator
        /// </summary>
        bool IsSeparator { get; }

        /// <summary>
        /// Value for particular list item
        /// </summary>
        string Value { get; }

        /// <summary>
        /// Label for particular list item
        /// </summary>
        string Label { get; }
    }

    public static class LimitTemplatingExtensions
    {
        /// <summary>
        /// Template region for limit plugin
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static LimitPluginTemplateRegion Limit(this IViewPlugins t, string templateId = "limit")
        {
            return new LimitPluginTemplateRegion(t, templateId);
        }


        /// <summary>
        /// Binds limit changing event
        /// </summary>
        /// <param name="tpl"></param>
        /// <param name="eventId">DOM event id</param>
        /// <returns></returns>
        public static SpecialString BindLimitChangeEvent(this ParametrizedCodeBlock<ILimitSize> tpl, string eventId)
        {
            return tpl.BindEvent("changeLimitHandler", eventId, tpl.ExistingModel + ".Value");
        }

        /// <summary>
        /// Binds limit changing event to any element among plugin
        /// </summary>
        /// <param name="tpl"></param>
        /// <param name="eventId">DOM event id</param>
        /// <param name="value">Limit value</param>
        /// <returns></returns>
        public static SpecialString BindLimitChangeEvent(this LimitPluginTemplateRegion tpl, string eventId, string value)
        {
            return tpl.BindEvent("changeLimitHandler", eventId, value);
        }

    }

}
