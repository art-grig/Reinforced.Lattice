using System;
using Newtonsoft.Json.Linq;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
{

    /// <summary>
    /// Configurable table event subscription
    /// </summary>
    public class TableEventSubscription
    {
        internal ConfiguredSubscriptionInfo SubscriptionInfo { get; set; }

        public TableEventSubscription()
        {
            SubscriptionInfo = new ConfiguredSubscriptionInfo();
        }
    }

    public static class TableEventSubscriptionExtensions
    {

        /// <summary>
        /// Configures table event subscription to handle specified event
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="handler">Handler function that supplies data object as first parameter and row element as second one (inline function or function name)</param>
        /// <returns>Fluent</returns>        
        public static TableEventSubscription Handler(this TableEventSubscription conf, string handler)
        {
            conf.SubscriptionInfo.Handler = new JRaw(handler);
            return conf;
        }

        /// <summary>
        /// Configures table event subscription to handle specified event
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="eventId">DOM event ID. You can use clas DomEvent here</param>
        /// <returns>Fluent</returns>        
        public static TableEventSubscription Event(this TableEventSubscription conf, string eventId)
        {
            conf.SubscriptionInfo.DomEvent = eventId;            
            return conf;
        }

        /// <summary>
        /// Configures table event subscription to handle specified event
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="eventId">DOM event ID. You can use clas DomEvent here</param>
        /// <param name="handler">Handler function that supplies data object as first parameter and row element as second one (inline function or function name)</param>
        /// <returns>Fluent</returns>        
        public static TableEventSubscription Handle(this TableEventSubscription conf, DOMEvent eventId, string handler)
        {
            conf.SubscriptionInfo.DomEvent = eventId;
            conf.SubscriptionInfo.Handler = new JRaw(handler);
            return conf;
        }

        /// <summary>
        /// Configures table event subscription to handle specified event
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="eventId">DOM event ID. You can use clas DomEvent here</param>
        /// <param name="commandName">Command to invoke</param>
        /// <returns>Fluent</returns>        
        public static TableEventSubscription Command(this TableEventSubscription conf, DOMEvent eventId, string commandName)
        {
            conf.SubscriptionInfo.DomEvent = eventId;
            conf.SubscriptionInfo.Handler = new JRaw(string.Format("function(e) {{ e.Master.Commands.triggerCommandOnRow('{0}',e.Row); }}",commandName));
            return conf;
        }

        /// <summary>
        /// Configures table event subscription to handle event on specified selector
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="selector">Selector, that element should satisfy to fire event</param>
        /// <returns>Fluent</returns>
        public static TableEventSubscription Selector(this TableEventSubscription conf, string selector)
        {
            conf.SubscriptionInfo.Selector = selector;
            return conf;
        }


        /// <summary>
        /// Configures table event subscription to handle event on specified data-* selector
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="data">Data marker</param>
        /// <returns>Fluent</returns>
        public static TableEventSubscription DataSelector(this TableEventSubscription conf, string data)
        {
            conf.SubscriptionInfo.Selector = String.Format("[data-{0}]",data);
            return conf;
        }

        /// <summary>
        /// Redirects table event to specified plugin
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="eventId">DOM event ID. You can use clas DomEvent here</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="functionName">Plugin function to call when event occurs</param>
        /// <param name="where">Plugin position. Optionsl</param>
        /// <returns>Fluent</returns>        
        public static TableEventSubscription StreamEventToPlugin(this TableEventSubscription conf, DOMEvent eventId, string pluginId,string functionName,string where = null)
        {
            var fn = string.Empty;
            if (string.IsNullOrEmpty(where))
            {
                fn = string.Format("function(e) {{ e.Master.InstanceManager.getPlugin('{0}').{1}(e); }}", pluginId,
                    functionName);
            }
            else
            {
                fn = string.Format("function(e) {{ e.Master.InstanceManager.getPlugin('{0}','{2}').{1}(e); }}", pluginId,
                    functionName,where);
            }
            conf.SubscriptionInfo.DomEvent = eventId;
            conf.SubscriptionInfo.Handler = new JRaw(fn);
            return conf;
        }

        /// <summary>
        /// Redirects table event to specified plugin
        /// </summary>
        /// <param name="conf">Table event subscription configurator</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <param name="functionName">Plugin function to call when event occurs</param>
        /// <param name="where">Plugin position. Optionsl</param>
        /// <returns>Fluent</returns>        
        public static TableEventSubscription HandleByPlugin(this TableEventSubscription conf,string pluginId, string functionName, string where = null)
        {
            var fn = string.Empty;
            if (string.IsNullOrEmpty(where))
            {
                fn = string.Format("function(e) {{ e.Master.InstanceManager.getPlugin('{0}').{1}(e); }}", pluginId,
                    functionName);
            }
            else
            {
                fn = string.Format("function(e) {{ e.Master.InstanceManager.getPlugin('{0}','{2}').{1}(e); }}", pluginId,
                    functionName, where);
            }
            conf.SubscriptionInfo.Handler = new JRaw(fn);
            return conf;
        }
    }
}
