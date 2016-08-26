using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.ResponseProcessing;

namespace PowerTables.Defaults
{
    /// <summary>
    /// ICommandHandler implementation that can wrap any delegate to command handler. 
    /// This implementation supports both sync and async delegate commands. 
    /// See also <see cref="ICommandHandler"/>
    /// </summary>
    public class DelegateCommandHandler<TSourceData, TTargetData, TResponse> : ICommandHandler where TTargetData : new()
    {
        private readonly Func<PowerTablesData<TSourceData, TTargetData>, TResponse> _handlerMethod;
        private readonly Func<PowerTablesData<TSourceData, TTargetData>, Task<TResponse>> _asynchandlerMethod;
        private readonly bool _forceDeferred;

        /// <summary>
        /// Constructs new DelegateCommandHandler instance
        /// </summary>
        /// <param name="asynchandlerMethod">Async method that should be executed</param>
        /// <param name="forceDeferred"></param>
        public DelegateCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, Task<TResponse>> asynchandlerMethod, bool forceDeferred = false)
        {
            _asynchandlerMethod = asynchandlerMethod;
            _forceDeferred = forceDeferred;
        }

        /// <summary>
        /// Constructs new delegate command handler
        /// </summary>
        /// <param name="handlerMethod">Method implementing command</param>
        /// <param name="forceDeferred">Should this command be deferred (query cached for further results retrieving)</param>
        public DelegateCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, TResponse> handlerMethod, bool forceDeferred = false)
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
        public DelegateCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, TResponse> handlerMethod, Func<PowerTablesData<TSourceData, TTargetData>, Task<TResponse>> asynchandlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
            _asynchandlerMethod = asynchandlerMethod;
            _forceDeferred = forceDeferred;
        }

        public ActionResult Handle(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            if (_handlerMethod == null)
            {
                throw new Exception("This is asynchronous command handler. Please use it with .HandleAsync, not .Handle.");
            }

            PowerTablesData<TSourceData, TTargetData> typedData = new PowerTablesData<TSourceData, TTargetData>(data);
            var response = _handlerMethod(typedData);

            if (typeof(PowerTablesResponse).IsAssignableFrom(typeof(TResponse)))
            {
                responseModifiers.ApplyResponseModifiers(data, (PowerTablesResponse)(object)response);
            }
            var o = response as ActionResult;
            if (o != null) return o;
            return new JsonNetResult() { Data = response, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public async Task<ActionResult> HandleAsync(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            PowerTablesData<TSourceData, TTargetData> typedData = new PowerTablesData<TSourceData, TTargetData>(data);
            TResponse response;

            if (_asynchandlerMethod != null) response = await _asynchandlerMethod(typedData).ConfigureAwait(false);
            else response = _handlerMethod(typedData);

            if (typeof(PowerTablesResponse).IsAssignableFrom(typeof(TResponse)))
            {
                responseModifiers.ApplyResponseModifiers(data, (PowerTablesResponse)(object)response);
            }
            var o = response as ActionResult;
            if (o != null) return o;
            return new JsonNetResult() { Data = response, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public bool IsDeferable
        {
            get
            {
                return _forceDeferred || (
                    typeof(FileResult).IsAssignableFrom(typeof(TResponse)) ||
                    typeof(RedirectResult).IsAssignableFrom(typeof(TResponse)));
            }
        }

        /// <summary>
        /// Type of command result
        /// </summary>
        public Type ResultType { get { return typeof(TResponse); } }
    }

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
        public static void AddCommandHandler<TSourceData, TTargetData, TResponse>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            string command,
            Func<PowerTablesData<TSourceData, TTargetData>, TResponse> method,
            bool forceDeferred = false) where TTargetData : new()
        {
            var del = new DelegateCommandHandler<TSourceData, TTargetData, TResponse>(method, forceDeferred: forceDeferred);

            handler.RegisterCommandHandler(command, del);
        }

        /// <summary>
        /// Registers asynchronous delegate command handler
        /// </summary>
        /// <param name="handler">Request handler</param>
        /// <param name="command">String command identifier</param>
        /// <param name="method">Asynchronous method implementing command</param>
        /// <param name="forceDeferred">Should this command be deferred (query cached for further results retrieving)</param>
        public static void AddCommandHandler<TSourceData, TTargetData, TResponse>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            string command,
            Func<PowerTablesData<TSourceData, TTargetData>, Task<TResponse>> method,
            bool forceDeferred = false) where TTargetData : new()
        {
            var del = new DelegateCommandHandler<TSourceData, TTargetData, TResponse>(method, forceDeferred: forceDeferred);
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
        public static void AddCommandHandler<TSourceData, TTargetData, TResponse>(
           this PowerTablesHandler<TSourceData, TTargetData> handler, string command,
            Func<PowerTablesData<TSourceData, TTargetData>, Task<TResponse>> asyncMethod,
            Func<PowerTablesData<TSourceData, TTargetData>, TResponse> syncmethod,
            bool forceDeferred = false) where TTargetData : new()
        {
            var del = new DelegateCommandHandler<TSourceData, TTargetData, TResponse>(syncmethod, asyncMethod, forceDeferred: forceDeferred);
            handler.RegisterCommandHandler(command, del);
        }

    }
}
