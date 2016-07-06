using System;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Templating;

namespace PowerTables.Plugins.RowAction
{
    public static class RowActionExtensions
    {
        public const string PluginId = "RowAction";

        public static T RowAction<T>(this T conf, string actionId, Action<ClientRowAction> action, DOMEvent @event = null) where T : IConfigurator
        {
            ClientRowAction ra = new ClientRowAction();
            action(ra);
            conf.TableConfiguration.UpdatePluginConfig<RowActionUiConfiguration>(PluginId, ui =>
            {
                ui.Configuration.RowActionDescriptions[actionId] = ra.Action;
            });
            if (@event == null) @event = "click";

            TableEventSubscription tes = new TableEventSubscription();
            tes.Selector(string.Format("[data-ra='{0}']", actionId));
            tes.Handle(@event, string.Format("function(v) {{ v.Master.InstanceManager.getPlugin('RowAction').trigger('{0}'); }}", actionId));
            conf.SubscribeRowEvent(tes);

            return conf;
        }
    }
}
