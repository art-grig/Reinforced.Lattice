using Reinforced.Lattice.Plugins.Toolbar;
using Reinforced.Lattice.Templates.Compilation;
using Reinforced.Lattice.Templates.Expressions;

namespace Reinforced.Lattice.Templates.Plugins.Toolbar
{
    public class ToolbarTemplateRegion : PluginTemplateRegion, IModelProvider<IToolbarViewModel>
    {
        public string ExistingModel { get; private set; }

        public ToolbarTemplateRegion(IViewPlugins page, string id)
            : base(page, id)
        {
        }
    }

    public class ButtonsSetTemplateRegion : ParametrizedCodeBlock<ToolbarButtonClientConfiguration>
        , IProvidesMarking
        , IProvidesEventsBinding
    {
        public ButtonsSetTemplateRegion(IRawProvider writer)
            : base("for(var i=0;i<o.Configuration.Buttons.length;i++){var b=o.Configuration.Buttons[i];", "}", writer)
        {
        }

        public override string ExistingModel { get { return "b"; } }
    }

    /// <summary>
    /// ViewModel for toolbar plugin
    /// </summary>
    public interface IToolbarViewModel
    {
        /// <summary>
        /// Client configuration
        /// </summary>
        ToolbarButtonsClientConfiguration Configuration { get; }
    }

    public static class ToolbarTemplatingExtensions
    {
        /// <summary>
        /// Template region for toolbar plugin
        /// </summary>
        /// <param name="t"></param>
        /// <param name="templateId">Template ID (default is "toolbar")</param>
        public static ToolbarTemplateRegion Toolbar(this IViewPlugins t, string templateId = "toolbar")
        {
            return new ToolbarTemplateRegion(t, "toolbar");
        }

        /// <summary>
        /// Buttons of Toolbar plugin
        /// </summary>
        /// <param name="t"></param>
        /// <returns></returns>
        public static ButtonsSetTemplateRegion Buttons(this ToolbarTemplateRegion t)
        {
            return new ButtonsSetTemplateRegion(t);
        }

        /// <summary>
        /// Binds button action for specified button
        /// </summary>
        /// <param name="m"></param>
        /// <param name="eventId">DOM event</param>
        /// <returns></returns>
        public static SpecialString BindButton(this ButtonsSetTemplateRegion m, string eventId)
        {
            var mark = m.Mark("AllButtons", m.Property(c => c.InternalId));
            var events = m.BindEvent("buttonHandleEvent", eventId, m.Property(c => c.InternalId));
            return m._(mark + " " + events);
        }
    }

}
