using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;
using PowerTables.Configuration;
using PowerTables.Processing;

namespace PowerTables.Mvc
{
    public class MvcRequestHandler<TSource, TData> : RequestHandlerBase<TSource, TData, ActionResult> where TData : new()
    {
        private readonly ControllerContext _context;

        public MvcRequestHandler(ControllerContext context, Configurator<TSource, TData> configurator, IQueryHandler<TSource, TData> queryHandler = null, ITokenStorage tokenStorage = null) : base(configurator, queryHandler, tokenStorage)
        {
            _context = context;
        }

        protected override LatticeRequest ExtractRequestCore()
        {
            if (_context.HttpContext.Request.HttpMethod == "GET")
            {
                var token = _context.HttpContext.Request.QueryString["q"];
                return TokenStorage.Lookup(token);
            }

            var request = _context.RequestContext.HttpContext.Request;
            request.InputStream.Seek(0, SeekOrigin.Begin);
            string jsonData = new StreamReader(request.InputStream).ReadToEnd();
            return JsonConvert.DeserializeObject<LatticeRequest>(jsonData);
        }

        protected override ActionResult FormatError(LatticeResponse errorResponse)
        {
            return new JsonNetResult() { Data = errorResponse, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        protected override ActionResult ProduceRedirect(string token)
        {
            return new ContentResult()
            {
                Content = InMemoryTokenStorage.TokenPrefix + token,
                ContentEncoding = Encoding.UTF8,
                ContentType = "lattice/service"
            };
        }

        protected override bool IsCommandAutoDeferred(ICommandHandler handler)
        {
            return typeof(FileResult).IsAssignableFrom(handler.UnprocessedResultType) ||
                   typeof(RedirectResult).IsAssignableFrom(handler.UnprocessedResultType);
        }

        public override ActionResult ProduceResponse(LatticeData data, Type cType, object commandResponse)
        {
            if (cType == typeof(LatticeResponse))
            {
                var result = commandResponse as LatticeResponse;
                try
                {
                    ApplyResponseModifiers(data, result);
                }
                catch (Exception ex)
                {
                    result.FormatException(ex);
                }
            }
            if (typeof(ActionResult).IsAssignableFrom(cType))
            {
                return commandResponse as ActionResult;
            }

            return new JsonNetResult() { Data = commandResponse, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public override TStaticData ExtractStaticData<TStaticData>()
        {
            var req = ExtractRequest();
            if (string.IsNullOrEmpty(req.Query.StaticDataJson)) return null;
            return JsonConvert.DeserializeObject<TStaticData>(req.Query.StaticDataJson);
        }
    }

    public static class MvcHandlerExtensions
    {
        public static MvcRequestHandler<TSourceData, TTableData> CreateMvcHandler<TSourceData, TTableData>(
            this Configurator<TSourceData, TTableData> configurator, ControllerContext controllerContext, IQueryHandler<TSourceData, TTableData> queryHandler = null,
            ITokenStorage tokenStorage = null) where TTableData : new()
        {
            return new MvcRequestHandler<TSourceData, TTableData>(controllerContext, configurator, queryHandler, tokenStorage);
        }
    }
}
