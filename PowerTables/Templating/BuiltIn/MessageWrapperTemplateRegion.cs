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


        public bool IsTrackSet { get; set; }

        public MessageWrapperTemplateRegion(string prefix, string id, TextWriter writer)
            : base(prefix, id, writer)
        {
        }
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
        public static MessageWrapperTemplateRegion MessagesWrapper(this TemplatesPageBase t, string templateId = "messages")
        {
            return new MessageWrapperTemplateRegion(t.Model.Prefix, templateId, t.Output);
        }
    }
}
