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
        string Title { get; }

        /// <summary>
        /// Additional data text
        /// </summary>
        string Details { get; }

        /// <summary>
        /// Message type string
        /// </summary>
        string Class { get; }

        /// <summary>
        /// Columns count
        /// </summary>
        int UiColumnsCount { get; }
    }

    public static class MessagesTemplatesExtensions
    {
        public static MessageWrapperTemplateRegion MessagesWrapper(this ITemplatesScope t, string templateId = "messages")
        {
            return new MessageWrapperTemplateRegion(t.TemplatesPrefix, templateId, t.Output);
        }
    }
}
