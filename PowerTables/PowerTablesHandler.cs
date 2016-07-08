using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using PowerTables.Configuration;
using PowerTables.Defaults;
using PowerTables.ResponseProcessing;

namespace PowerTables
{
    /// <summary>
    /// Handler of requests to table
    /// </summary>
    /// <typeparam name="TSourceData">Source raw data type</typeparam>
    /// <typeparam name="TTableData">Table row data type</typeparam>
    public class PowerTablesHandler<TSourceData, TTableData> : IResponseModifiersApplier where TTableData : new()
    {
        private readonly Configurator<TSourceData, TTableData> _configuration;
        private readonly IQueryHandler<TSourceData, TTableData> _queryHandler;

        /// <summary>
        /// Table configurator
        /// </summary>
        public Configurator<TSourceData, TTableData> Configuration
        {
            get { return _configuration; }
        }

        /// <summary>
        /// Constructs new table handler
        /// </summary>
        /// <param name="configuration">Source table configurator</param>
        /// <param name="queryHandler">(optional) Query handler that will handle source data selecting</param>
        public PowerTablesHandler(Configurator<TSourceData, TTableData> configuration, IQueryHandler<TSourceData, TTableData> queryHandler = null)
        {
            _configuration = configuration;
            _queryHandler = queryHandler ?? new DefaultQueryHandler<TSourceData, TTableData>();
            _queryHandler.SetConfigurator(_configuration);
        }
        private Dictionary<string, ICommandHandler> _inplaceCommandHandlers = new Dictionary<string, ICommandHandler>();

        private ICommandHandler ResolveCommandHandler(string command)
        {
            if (_inplaceCommandHandlers.ContainsKey(command)) return _inplaceCommandHandlers[command];
            if (!_configuration.CommandHandlerTypes.ContainsKey(command))
            {
                throw new Exception(String.Format("Cannot handle unknown table command {0}", command));
            }
            var commandHandlerType = _configuration.CommandHandlerTypes[command];
            ICommandHandler commandHandler = (ICommandHandler)Activator.CreateInstance(commandHandlerType);
            return commandHandler;
        }

        /// <summary>
        /// Registers a user custom command handler
        /// </summary>
        /// <param name="command">String command identifier</param>
        /// <param name="handler">Command handler implementation</param>
        public void RegisterCommandHandler(string command, ICommandHandler handler)
        {
            if (_inplaceCommandHandlers.ContainsKey(command))
            {
                var hndlr = _inplaceCommandHandlers[command];
                throw new Exception(String.Format("Cannot register in-place handler: command {0} is already handled by {1}", command, hndlr.GetType().FullName));
            }
            _inplaceCommandHandlers[command] = handler;
        }

        private PowerTablesData ProduceData(IQueryable<TSourceData> source, PowerTableRequest request)
        {
            try
            {
                //gather data
                var filtered = _queryHandler.ApplyFiltering(source, request.Query);
                var ordered = _queryHandler.ApplyOrdering(filtered, request.Query);
                long count = 0;
                int page = 0;
               

                var paged = _queryHandler.ApplyPaging(ordered, request.Query, out count, out page);
                var mapped = new Lazy<TTableData[]>(() => _queryHandler.ApplyMapping(paged, request.Query));
                var mappedObject =
                    new Lazy<object[]>(() => _queryHandler.ApplyMapping(paged, request.Query).Cast<object>().ToArray());

                var data = new PowerTablesData(source, filtered, ordered, paged, mappedObject, _configuration, request,
                    count,
                    page);
                data._OriginalLazy = mapped;
                return data;
            }
            catch (InvalidOperationException ex)
            {
                throw new Exception(
                    String.Format(@"InvalidOperationException thrown.
We recommend to re-check filters configuration against filtering/mapping on nullable columns. 
Lattice does not throw InvalidOperationException itself, but we not always handle filtering of nullable columns 
because it is highly dependent on query provider.
Consider usage of null-coalescing operator (??) within your nullables.
Btw, original message was: {0}", ex.Message),
                    ex);
            }
        }

        /// <summary>
        /// Entirely handles request to table. This method will extract all needed data from ControllerContext. Not needed additional information.
        /// </summary>
        /// <param name="source">Source data set</param>
        /// <param name="context">Controller context</param>
        /// <returns>ActionResult that should be sent to client</returns>
        public ActionResult Handle(IQueryable<TSourceData> source, ControllerContext context)
        {
            try
            {
                PowerTableRequest request = _queryHandler.ExtractRequest(context);
                ICommandHandler commandHandler = ResolveCommandHandler(request.Command);

                if (!request.IsDeferred && commandHandler.IsDeferable)
                {
                    request.IsDeferred = true;
                    var token = InMemoryTokenStorage.StoreRequest(request);
                    return new ContentResult() { Content = InMemoryTokenStorage.TokenPrefix + token, ContentEncoding = Encoding.UTF8, ContentType = "lattice/service" };
                }
                var data = ProduceData(source, request);

                return commandHandler.Handle(data, this);
            }
            catch (Exception ex)
            {
                return ProduceError(ex);
            }
        }

        /// <summary>
        /// Entirely handles request to table. This method will extract all needed data from ControllerContext. Not needed additional information.
        /// </summary>
        /// <param name="source">Source data set</param>
        /// <param name="context">Controller context</param>
        /// <returns>ActionResult that should be sent to client</returns>
        public async Task<ActionResult> HandleAsync(IQueryable<TSourceData> source, ControllerContext context)
        {
            try
            {
                PowerTableRequest request = _queryHandler.ExtractRequest(context);
                ICommandHandler commandHandler = ResolveCommandHandler(request.Command);

                if (!request.IsDeferred && commandHandler.IsDeferable)
                {
                    request.IsDeferred = true;
                    var token = InMemoryTokenStorage.StoreRequest(request);
                    return new ContentResult() { Content = InMemoryTokenStorage.TokenPrefix + token, ContentEncoding = Encoding.UTF8, ContentType = "lattice/service" };
                }
                var data = ProduceData(source, request);

                return await commandHandler.HandleAsync(data, this);
            }
            catch (Exception ex)
            {
                return ProduceError(ex);
            }
        }

        /// <summary>
        /// Extracts static data from request predefined with Configurator.JsonConfig("...", data)
        /// </summary>
        /// <typeparam name="TStaticData">Type of static data</typeparam>
        /// <param name="context">Controller context</param>
        /// <returns>Static data instance</returns>
        public TStaticData ExtractStaticData<TStaticData>(ControllerContext context) where TStaticData : class
        {
            var req = _queryHandler.ExtractRequest(context);
            if (string.IsNullOrEmpty(req.Query.StaticDataJson)) return null;
            return JsonConvert.DeserializeObject<TStaticData>(req.Query.StaticDataJson);
        }

        /// <summary>
        /// Extracts request object from supplied controller context
        /// </summary>
        /// <param name="context">Controller context</param>
        /// <returns>PowerTables request instance</returns>
        public PowerTableRequest ExtractRequest(ControllerContext context)
        {
            var req = _queryHandler.ExtractRequest(context);
            return req;
        }

        private ActionResult ProduceError(Exception ex)
        {
            PowerTablesResponse ptr = new PowerTablesResponse();
            ptr.FormatException(ex);
            return new JsonNetResult() { Data = ptr, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }


        /// <summary>
        /// Applies response modifiers. An implementation for IResponseModifiersApplier. Should not be used directly
        /// </summary>
        /// <param name="data">Selected and prepared data</param>
        /// <param name="response">Existing response</param>
        void IResponseModifiersApplier.ApplyResponseModifiers(PowerTablesData data, PowerTablesResponse response)
        {
            foreach (var responseModifier in _configuration.ResponseModifiers)
            {
                responseModifier.ModifyResponse(data, response);
            }
        }


    }
}
