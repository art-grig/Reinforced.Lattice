﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating.BuiltIn
{
    public class MessageTemplateRegion : ModeledTemplateRegion<ICellModel<IMessageRowModel>>,
        IProvidesTracking
    {


        public bool IsTrackSet { get; set; }

        public MessageTemplateRegion(string prefix, string id, TextWriter writer)
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
        public static MessageTemplateRegion Message(this ITemplatesScope t, string messageClass)
        {
            return new MessageTemplateRegion(t.TemplatesPrefix, "ltmsg-" + messageClass, t.Output);
        }
    }
}
