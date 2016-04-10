using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.BuiltIn
{
    public class MessageWrapperTemplateRegion : ModeledTemplateRegion<IMessageRowModel>, 
        IProvidesTracking
    {
        public MessageWrapperTemplateRegion(string prefix, TextWriter writer) : base(prefix, "messages", writer)
        {
        }

        public bool IsTrackSet { get; set; }
    }

    /// <summary>
    /// Information row viewmodel
    /// </summary>
    public interface IMessageRowModel
    {
        /// <summary>
        /// Message primary text
        /// </summary>
        string Message { get; }

        /// <summary>
        /// Additional data text
        /// </summary>
        string AdditionalData { get; }

        /// <summary>
        /// Message type string
        /// </summary>
        string MessageType { get; }

        /// <summary>
        /// Columns count
        /// </summary>
        int UiColumnsCount { get; }
    }

    public static class MessagesTemplatesExtensions
    {
        public static MessageWrapperTemplateRegion MessagesWrapper(this TemplatesPageBase t)
        {
            return new MessageWrapperTemplateRegion(t.Model.Prefix,t.Output);
        }
    }
}
