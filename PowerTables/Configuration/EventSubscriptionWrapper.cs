using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        public static TableEventSubscription Handle(this TableEventSubscription conf, string eventId, string handler)
        {
            conf.SubscriptionInfo.DomEvent = eventId;
            conf.SubscriptionInfo.Handler = new JRaw(handler);
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
    }
}
