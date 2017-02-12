namespace Reinforced.Lattice.Plugins
{
    public static class PluginConfigurationExtensions
    {

        /// <summary>
        /// Places plugin's UI at specified template region
        /// </summary>
        /// <param name="ui">Plugin configuration</param>
        /// <param name="placement">Plugin placement</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<T> PlaceAt<T>(this PluginConfigurationWrapper<T> ui, string placement) where T : new()
        {
            ui.Placement = placement;
            return ui;
        }

        /// <summary>
        /// Sets plugin's UI order among specified location
        /// </summary>
        /// <param name="ui">Plugin configuration</param>
        /// <param name="order">Plugin placement</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<T> Order<T>(this PluginConfigurationWrapper<T> ui, int order) where T : new()
        {
            ui.Order = order;
            return ui;
        }

        /// <summary>
        /// Sets plugin's UI template Id (for plugins that are supporting templating)
        /// </summary>
        /// <param name="ui">Plugin configuration</param>
        /// <param name="templateId">Template ID being used by plugin</param>
        /// <returns></returns>
        public static PluginConfigurationWrapper<T> Template<T>(this PluginConfigurationWrapper<T> ui, string templateId) where T : IProvidesTemplate,new()
        {
            ui.TemplateId = templateId;
            return ui;
        }

    }
}
