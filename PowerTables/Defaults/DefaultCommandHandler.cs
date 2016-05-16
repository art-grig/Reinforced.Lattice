using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.ResponseProcessing;

namespace PowerTables.Defaults
{
    /// <summary>
    /// Default implementation of command handler. 
    /// This command uses "query" command to provide table with data.
    /// </summary>
    public class DefaultCommandHandler : ICommandHandler
    {
        /// <summary>
        /// Default query command name
        /// </summary>
        public const string CommandId = "query";

        public ActionResult Handle(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            // queryable reveals here
            var mapped = data.Mapped.Value;
            PowerTablesResponse ptr = new PowerTablesResponse()
            {
                PageIndex = data.CurrentPage,
                ResultsCount = data.ResultsCount,
                Data = data.Configuration.EncodeResults(mapped),
                AdditionalData = new Dictionary<string, object>(),
                Success = false
            };

            try
            {
                responseModifiers.ApplyResponseModifiers(data, ptr);
            }
            catch (Exception ex)
            {
                ptr.FormatException(ex);
            }

            ptr.Success = true;
            return new JsonNetResult() { Data = ptr, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public Task<ActionResult> HandleAsync(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            return Task.FromResult(Handle(data, responseModifiers));
        }

        public bool IsDeferable { get { return false; } }
    }
}
