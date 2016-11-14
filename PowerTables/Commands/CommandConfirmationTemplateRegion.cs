using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.Toolbar;
using PowerTables.Templating;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Commands
{
    public class CommandConfirmationTemplateRegion<TRow,TConfirmation> : PluginTemplateRegion
        , IModelProvider<IConfirmationViewModel<TRow, TConfirmation>>
    {
        public CommandConfirmationTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
    }

    
    /// <summary>
    /// Command confirmation viewmodel
    /// </summary>
    public interface IConfirmationViewModel<TRow, TConfirmation>
    {
        IHbArray<TRow> Selection { get; set; }

        TRow Subject { get; set; }
    }

    public static class CommandConfirmationTemplateExtensions
    {
        /// <summary>
        /// Template region for limit plugin
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static CommandConfirmationTemplateRegion<TRow, TConfirmation> Confirmation<TRow, TConfirmation>(this IViewPlugins t, string templateId)
        {
            return new CommandConfirmationTemplateRegion<TRow, TConfirmation>(t, templateId);
        }
        /// <summary>
        /// Template region for limit plugin
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static CommandConfirmationTemplateRegion<object, object> Confirmation(this IViewPlugins t, string templateId)
        {
            return new CommandConfirmationTemplateRegion<object, object>(t, templateId);
        }

        public static MvcHtmlString BindDismiss<TRow, TForm>(this  CommandConfirmationTemplateRegion<TRow, TForm> p, string eventId)
        {
            return p.BindEvent("dismiss", eventId);
        }

        public static MvcHtmlString BindConfirm<TRow, TForm>(this  CommandConfirmationTemplateRegion<TRow, TForm> p, string eventId)
        {
            return p.BindEvent("confirm", eventId);
        }
    }
}
