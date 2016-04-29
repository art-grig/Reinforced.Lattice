using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PowerTables
{
    /// <summary>
    /// JSON model for table message
    /// </summary>
    public class TableMessage
    {
        [JsonProperty("__Go7XIV13OA")]
        public bool IsMessage { get { return true; } }

        /// <summary>
        /// Message type. 
        /// Banners are shown instead of table data.
        /// User messages are shown using custom message display functions
        /// </summary>
        public MessageType Type { get; set; }

        /// <summary>
        /// Message title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Message details (full HTML)
        /// </summary>
        public string Details { get; set; }

        /// <summary>
        /// Message class
        /// </summary>
        public string Class { get; set; }

        public static TableMessage Banner(string messageClass, string title, string details = null)
        {
            return new TableMessage()
            {
                Title = title,
                Details = details,
                Type = MessageType.Banner,
                Class = messageClass
            };
        }

        public static TableMessage User(string messageClass, string title, string details = null)
        {
            return new TableMessage()
            {
                Title = title,
                Details = details,
                Type = MessageType.UserMessage,
                Class = messageClass
            };
        }
    }

    /// <summary>
    /// Message type enum
    /// </summary>
    public enum MessageType
    {
        /// <summary>
        /// UserMessage is shown using specified custom functions for 
        /// messages showing
        /// </summary>
        UserMessage,

        /// <summary>
        /// Banner message is displayed among whole table instead of data
        /// </summary>
        Banner
    }
}
