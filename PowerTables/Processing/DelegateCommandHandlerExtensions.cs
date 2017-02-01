using System;
using System.Threading.Tasks;

namespace PowerTables.Processing
{
    /// <summary>
    /// Extensions for delegate command handler
    /// </summary>
    public static class DelegateCommandHandlerExtensions
    {
        /// <summary>
        /// Registers delegate command handler
        /// </summary>
        /// <param name="handler">Request handler</param>
        /// <param name="command">String command identifier</param>
        /// <param name="method">Method implementing command</param>
        /// <param name="forceDeferred">Should this command be deferred (query cached for further results retrieving)</param>
        public static void AddCommandHandler<TSourceData, TTargetData, TResponse, TCommandResult>(
            this RequestHandlerBase<TSourceData, TTargetData,TResponse> handler,
            string command,
            Func<PowerTablesData<TSourceData, TTargetData>, TCommandResult> method,
            bool forceDeferred = false) where TTargetData : new()
        {
            var del = new DelegateCommandHandler<TSourceData, TTargetData, TCommandResult>(method, forceDeferred: forceDeferred);

            handler.RegisterCommandHandler(command, del);
        }

        /// <summary>
        /// Registers asynchronous delegate command handler
        /// </summary>
        /// <param name="handler">Request handler</param>
        /// <param name="command">String command identifier</param>
        /// <param name="method">Asynchronous method implementing command</param>
        /// <param name="forceDeferred">Should this command be deferred (query cached for further results retrieving)</param>
        public static void AddCommandHandler<TSourceData, TTargetData, TCommandResult, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            string command,
            Func<PowerTablesData<TSourceData, TTargetData>, Task<TCommandResult>> method,
            bool forceDeferred = false) where TTargetData : new()
        {
            var del = new DelegateCommandHandler<TSourceData, TTargetData, TCommandResult>(method, forceDeferred: forceDeferred);
            handler.RegisterCommandHandler(command, del);
        }

        /// <summary>
        /// Registers asynchronous delegate command handler
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTargetData"></typeparam>
        /// <typeparam name="TResponse"></typeparam>
        /// <param name="handler">Request handler</param>
        /// <param name="command">String command identifier</param>
        /// <param name="asyncMethod">Asynchronous method implementing command</param>
        /// <param name="syncmethod">Method implementing command</param>
        /// <param name="forceDeferred">Should this command be deferred (query cached for further results retrieving)</param>
        public static void AddCommandHandler<TSourceData, TTargetData, TCommandResult, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler, string command,
            Func<PowerTablesData<TSourceData, TTargetData>, Task<TCommandResult>> asyncMethod,
            Func<PowerTablesData<TSourceData, TTargetData>, TCommandResult> syncmethod,
            bool forceDeferred = false) where TTargetData : new()
        {
            var del = new DelegateCommandHandler<TSourceData, TTargetData, TCommandResult>(syncmethod, asyncMethod, forceDeferred: forceDeferred);
            handler.RegisterCommandHandler(command, del);
        }

    }
}