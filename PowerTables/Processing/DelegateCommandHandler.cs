using System;
using System.Threading.Tasks;

namespace PowerTables.Processing
{
    /// <summary>
    /// ICommandHandler implementation that can wrap any delegate to command handler. 
    /// This implementation supports both sync and async delegate commands. 
    /// See also <see cref="ICommandHandler"/>
    /// </summary>
    public class DelegateCommandHandler<TSourceData, TTargetData, TCommandResult> : CommandHandleBase<TCommandResult> where TTargetData : new()
    {
        private readonly Func<PowerTablesData<TSourceData, TTargetData>, TCommandResult> _handlerMethod;
        private readonly Func<PowerTablesData<TSourceData, TTargetData>, Task<TCommandResult>> _asynchandlerMethod;
        private bool _forceDeferred;

        /// <summary>
        /// Constructs new DelegateCommandHandler instance
        /// </summary>
        /// <param name="asynchandlerMethod">Async method that should be executed</param>
        /// <param name="forceDeferred"></param>
        public DelegateCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, Task<TCommandResult>> asynchandlerMethod, bool forceDeferred = false)
        {
            _asynchandlerMethod = asynchandlerMethod;
            _forceDeferred = forceDeferred;
        }

        /// <summary>
        /// Constructs new delegate command handler
        /// </summary>
        /// <param name="handlerMethod">Method implementing command</param>
        /// <param name="forceDeferred">Should this command be deferred (query cached for further results retrieving)</param>
        public DelegateCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, TCommandResult> handlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
            _forceDeferred = forceDeferred;
        }

        /// <summary>
        /// Constructs new delegate command handler
        /// </summary>
        /// <param name="handlerMethod">Method implementing command</param>
        /// <param name="asynchandlerMethod">Async method implementing command</param>
        /// <param name="forceDeferred">Should this command be deferred (query cached for further results retrieving)</param>
        public DelegateCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, TCommandResult> handlerMethod, Func<PowerTablesData<TSourceData, TTargetData>, Task<TCommandResult>> asynchandlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
            _asynchandlerMethod = asynchandlerMethod;
            _forceDeferred = forceDeferred;
        }

        protected override TCommandResult Handle(PowerTablesData data)
        {
            if (_handlerMethod == null)
            {
                throw new Exception("This is asynchronous command handler. Please use it with .HandleAsync, not .Handle.");
            }

            PowerTablesData<TSourceData, TTargetData> typedData = new PowerTablesData<TSourceData, TTargetData>(data);
            return _handlerMethod(typedData);
        }

        protected override async Task<TCommandResult> HandleAsync(PowerTablesData data)
        {
            PowerTablesData<TSourceData, TTargetData> typedData = new PowerTablesData<TSourceData, TTargetData>(data);
            TCommandResult response;

            if (_asynchandlerMethod != null) response = await _asynchandlerMethod(typedData).ConfigureAwait(false);
            else response = _handlerMethod(typedData);

            return response;
        }
    }
}
