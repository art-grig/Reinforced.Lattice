using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.ResponseProcessing;

namespace PowerTables.Editing
{
    class EditorCommandHandler<TSourceData, TTargetData> : ICommandHandler where TTargetData : new()
    {
        public const string EditAdditionalDataKey = "Edit";

        private readonly Action<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>> _handlerMethod;
        private readonly Func<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>, Task> _asynchandlerMethod;

        public EditorCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>, Task> asynchandlerMethod, bool forceDeferred = false)
        {
            _asynchandlerMethod = asynchandlerMethod;
        }

        public EditorCommandHandler(Action<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>> handlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
        }

        public EditorCommandHandler(Action<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>> handlerMethod, Func<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>, Task> asynchandlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
            _asynchandlerMethod = asynchandlerMethod;
        }

        public ActionResult Handle(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            if (_handlerMethod == null)
            {
                throw new Exception("This is asynchronous command handler. Please use it with .HandleAsync, not .Handle.");
            }

            PowerTablesData<TSourceData, TTargetData> typedData = new PowerTablesData<TSourceData, TTargetData>(data);
            var editionResult = new EditionResult();
            var wrapper = new EditionResultWrapper<TTargetData>(editionResult);
            wrapper.Confirm(data.Request.RetrieveAdditionalObject<TTargetData>(EditAdditionalDataKey));
            _handlerMethod(typedData, wrapper);
            return new JsonNetResult() { Data = editionResult, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public async Task<ActionResult> HandleAsync(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            PowerTablesData<TSourceData, TTargetData> typedData = new PowerTablesData<TSourceData, TTargetData>(data);
             var editionResult = new EditionResult();
            var wrapper = new EditionResultWrapper<TTargetData>(editionResult);
            wrapper.Confirm(data.Request.RetrieveAdditionalObject<TTargetData>(EditAdditionalDataKey));
            if (_asynchandlerMethod != null) await _asynchandlerMethod(typedData,wrapper).ConfigureAwait(false);
            else _handlerMethod(typedData,wrapper);
            return new JsonNetResult() { Data = editionResult, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public bool IsDeferable { get { return false; } }
    }

    public static class EditCommandHandlerExtensions
    {
        public const string EditCommand = "Edit";

        public static void AddEditHandler<TSourceData, TTargetData>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            Action<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>> method)
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(method);
            handler.RegisterCommandHandler(EditCommand, del);
        }

        public static void AddAsyncEditHandler<TSourceData, TTargetData>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>, Task> method) 
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(method);
            handler.RegisterCommandHandler(EditCommand, del);
        }

        public static void AddEditHandler<TSourceData, TTargetData>(
           this PowerTablesHandler<TSourceData, TTargetData> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>, Task> asyncMethod,
            Action<PowerTablesData<TSourceData, TTargetData>, EditionResultWrapper<TTargetData>> syncmethod) 
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(syncmethod, asyncMethod);
            handler.RegisterCommandHandler(EditCommand, del);
        }

    }
}
