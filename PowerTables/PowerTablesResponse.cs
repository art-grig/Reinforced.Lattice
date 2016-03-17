using System;
using System.Collections.Generic;

using PowerTables.ResponseProcessing;

namespace PowerTables
{
    /// <summary>
    /// The respons that is being sent to client script. 
    /// This entity contains query results to be shown in table and also additional data
    /// </summary>
    public class PowerTablesResponse
    {
        /// <summary>
        /// Total results count
        /// </summary>
        public int ResultsCount { get; set; }

        /// <summary>
        /// Current data page index 
        /// </summary>
        public int PageIndex { get; set; }

        /// <summary>
        /// Data itself (array of properties in order as declared for each object.
        /// <example>E.g.: if source table is class User { string Id; string Name } then this field should present resulting query in a following way: [User1.Id, User1.Name,User2.Id, User2.Name ...] etc</example>
        /// </summary>
        public object[] Data { get; set; }

        /// <summary>
        /// Additional data being serialized for client. 
        /// This field could contain anything that will be parsed on client side and corresponding actions will be performed. 
        /// See <see cref="IResponseModifier"/> 
        /// </summary>
        public Dictionary<string,object> AdditionalData { get; set; }

        /// <summary>
        /// Query succeeded: true/false
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Error message if not sucess
        /// </summary>
        public string Message { get; set; }

        public void FormatException(Exception ex)
        {
            Success = false;
            var st = ex.StackTrace;
            if (string.IsNullOrEmpty(st) && ex.InnerException != null)
            {
                st = ex.InnerException.StackTrace;
            }
            Message = String.Format("{0}\n____________________\n{1}", ex.Message, st);
        }
    }
}
