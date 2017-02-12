using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Processing;

namespace PowerTables
{
    public abstract class RequestHandlerBase<TSourceData, TTableData, TResult> where TTableData : new()
    {
        private readonly Configurator<TSourceData, TTableData> _configurator;
        private readonly IQueryHandler<TSourceData, TTableData> _queryHandler;
        private readonly ITokenStorage _tokenStorage;

        protected ITokenStorage TokenStorage { get { return _tokenStorage; } }

        /// <summary>
        /// Table configurator
        /// </summary>
        public Configurator<TSourceData, TTableData> Configurator
        {
            get { return _configurator; }
        }

        /// <summary>
        /// Constructs new table handler
        /// </summary>
        /// <param name="configurator">Source table configurator</param>
        /// <param name="queryHandler">(optional) Query handler that will handle source data selecting</param>
        /// <param name="tokenStorage">Implementation of token storage interface for correct handling of deferred queries inside distributed environment</param>
        public RequestHandlerBase(Configurator<TSourceData, TTableData> configurator, IQueryHandler<TSourceData, TTableData> queryHandler = null, ITokenStorage tokenStorage = null)
        {
            _configurator = configurator;
            _queryHandler = queryHandler ?? new DefaultQueryHandler<TSourceData, TTableData>();
            _queryHandler.SetConfigurator(_configurator);
            _tokenStorage = tokenStorage;
            if (_tokenStorage == null) _tokenStorage = InMemoryTokenStorage.Instance;
            this.RegisterCommandHandler(DefaultCommandHandler.CommandId, new DefaultCommandHandler());
        }


        private readonly Dictionary<string, ICommandHandler> _inplaceCommandHandlers = new Dictionary<string, ICommandHandler>();

        protected virtual ICommandHandler ResolveCommandHandler(string command)
        {
            if (_inplaceCommandHandlers.ContainsKey(command)) return _inplaceCommandHandlers[command];
            throw new Exception(String.Format("Cannot handle unknown table command {0}", command));
        }

        /// <summary>
        /// Registers a user custom command handler
        /// </summary>
        /// <param name="command">String command identifier</param>
        /// <param name="handler">Command handler implementation</param>
        public virtual void RegisterCommandHandler(string command, ICommandHandler handler)
        {
            if (_inplaceCommandHandlers.ContainsKey(command))
            {
                var hndlr = _inplaceCommandHandlers[command];
                throw new Exception(String.Format("Cannot register in-place handler: command {0} is already handled by {1}", command, hndlr.GetType().FullName));
            }
            handler.ForceDeferred = IsCommandAutoDeferred(handler);
            _inplaceCommandHandlers[command] = handler;
        }

        protected virtual bool IsCommandAutoDeferred(ICommandHandler handler)
        {
            return false;
        }

        protected virtual LatticeData ProduceData(IQueryable<TSourceData> source, LatticeRequest request)
        {
            try
            {
                //gather data
                var filtered = _queryHandler.ApplyFiltering(source, request.Query);
                var ordered = _queryHandler.ApplyOrdering(filtered, request.Query);
                long count = 0;
                int page = 0;


                var paged = _queryHandler.ApplyPaging(ordered, request.Query.Partition, out count);
                var mapped = new Lazy<TTableData[]>(() => _queryHandler.ApplyMapping(paged, request.Query));
                var mappedObject =
                    new Lazy<object[]>(() => _queryHandler.ApplyMapping(paged, request.Query).Cast<object>().ToArray());

                var data = new LatticeData(source, filtered, ordered, paged, mappedObject, _configurator, request,
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
        /// <returns>ActionResult that should be sent to client</returns>
        public virtual TResult Handle(IQueryable<TSourceData> source)
        {
            try
            {
                LatticeRequest request = ExtractRequest();
                var commandHandler = ResolveCommandHandler(request.Command);

                if (!request.IsDeferred && (commandHandler.ForceDeferred || IsCommandAutoDeferred(commandHandler)))
                {
                    request.IsDeferred = true;
                    var token = _tokenStorage.StoreRequest(request);
                    return ProduceRedirect(token);
                }
                var data = ProduceData(source, request);
                var result = commandHandler.HandleData(data);
                return ProduceResponse(data, commandHandler.UnprocessedResultType, result);
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
        /// <returns>ActionResult that should be sent to client</returns>
        public virtual async Task<TResult> HandleAsync(IQueryable<TSourceData> source)
        {
            try
            {
                LatticeRequest request = ExtractRequest();
                var commandHandler = ResolveCommandHandler(request.Command);

                if (!request.IsDeferred && commandHandler.ForceDeferred)
                {
                    request.IsDeferred = true;
                    var token = _tokenStorage.StoreRequest(request);
                    return await Task.FromResult(ProduceRedirect(token));
                }
                var data = ProduceData(source, request);

                var r = await commandHandler.HandleDataAsync(data);
                return ProduceResponse(data, commandHandler.UnprocessedResultType, r);
            }
            catch (Exception ex)
            {
                return ProduceError(ex);
            }
        }

        private TResult ProduceError(Exception ex)
        {
            LatticeResponse ptr = new LatticeResponse();
            ptr.FormatException(ex);
            return FormatError(ptr);
        }

        private LatticeRequest _request;
        public LatticeRequest ExtractRequest()
        {
            if (_request == null)
            {
                _request = ExtractRequestCore();
                _request.Configurator = Configurator;
            }
            return _request;
        }

        protected abstract LatticeRequest ExtractRequestCore();

        protected abstract TResult FormatError(LatticeResponse errorResponse);

        protected abstract TResult ProduceRedirect(string token);

        public abstract TResult ProduceResponse(LatticeData data, Type cType, object commandResponse);

        public abstract TStaticData ExtractStaticData<TStaticData>() where TStaticData : class;

        protected void ApplyResponseModifiers(LatticeData data, LatticeResponse response)
        {
            foreach (var responseModifier in _configurator.ResponseModifiers)
            {
                responseModifier.ModifyResponse(data, response);
            }
        }

        
    }
}
