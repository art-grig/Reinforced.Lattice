using System;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace PowerTables.Processing
{
    /// <summary>
    /// Default implementation of command handler. 
    /// This command uses "query" command to provide table with data.
    /// </summary>
    public class DefaultCommandHandler : CommandHandleBase<PowerTablesResponse>
    {
        /// <summary>
        /// Default query command name
        /// </summary>
        public const string CommandId = "query";

        protected override PowerTablesResponse Handle(PowerTablesData data)
        {
            // queryable reveals here
            var mapped = data.Mapped.Value;
            PowerTablesResponse result = new PowerTablesResponse()
            {
                PageIndex = data.CurrentPage,
                ResultsCount = data.ResultsCount,
                Data = data.Configuration.EncodeResults(mapped),
                BatchSize = mapped.Length,
                AdditionalData = new AdditionalDataContainer(),
                Success = true
            };

            return result;
        }

        protected override async Task<PowerTablesResponse> HandleAsync(PowerTablesData data)
        {
            return await Task.FromResult(Handle(data));
        }
    }
}
