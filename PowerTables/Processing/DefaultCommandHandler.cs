using System.Threading.Tasks;

namespace PowerTables.Processing
{
    /// <summary>
    /// Default implementation of command handler. 
    /// This command uses "query" command to provide table with data.
    /// </summary>
    public class DefaultCommandHandler : CommandHandleBase<LatticeResponse>
    {
        /// <summary>
        /// Default query command name
        /// </summary>
        public const string CommandId = "query";

        protected override LatticeResponse Handle(LatticeData data)
        {
            // queryable reveals here
            var mapped = data.Mapped.Value;
            LatticeResponse result = new LatticeResponse()
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

        protected override async Task<LatticeResponse> HandleAsync(LatticeData data)
        {
            return await Task.FromResult(Handle(data));
        }
    }
}
