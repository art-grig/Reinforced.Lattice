using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using PowerTables.ResponseProcessing;

namespace PowerTables.Editing
{
    class EditorCommandHandler<TSourceData, TTargetData> : ICommandHandler where TTargetData : new()
    {
        public const string EditAdditionalDataKey = "Edit";

        private readonly Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, TableAdjustment> _handlerMethod;
        private readonly Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> _asynchandlerMethod;

        public EditorCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> asynchandlerMethod, bool forceDeferred = false)
        {
            _asynchandlerMethod = asynchandlerMethod;
        }

        public EditorCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, TableAdjustment> handlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
        }

        public EditorCommandHandler(Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, TableAdjustment> handlerMethod, Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> asynchandlerMethod, bool forceDeferred = false)
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

            var update = _handlerMethod(typedData, data.Request.RetrieveAdditionalObject<TTargetData>(EditAdditionalDataKey));
            return new JsonNetResult() { Data = update, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public async Task<ActionResult> HandleAsync(PowerTablesData data, IResponseModifiersApplier responseModifiers)
        {
            PowerTablesData<TSourceData, TTargetData> typedData = new PowerTablesData<TSourceData, TTargetData>(data);
            var edited = data.Request.RetrieveAdditionalObject<TTargetData>(EditAdditionalDataKey);
            TableAdjustment result = null;

            if (_asynchandlerMethod != null) result = await _asynchandlerMethod(typedData, edited).ConfigureAwait(false);
            else result = _handlerMethod(typedData, edited);
            return new JsonNetResult() { Data = result, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
        }

        public bool IsDeferable { get { return false; } }
    }

    public static class EditCommandHandlerExtensions
    {
        public const string EditCommand = "Edit";

        public static void AddEditHandler<TSourceData, TTargetData>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, TableAdjustment> method)
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(method);
            handler.RegisterCommandHandler(EditCommand, del);
        }

        public static void AddAsyncEditHandler<TSourceData, TTargetData>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> method)
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(method);
            handler.RegisterCommandHandler(EditCommand, del);
        }

        public static void AddEditHandler<TSourceData, TTargetData>(
           this PowerTablesHandler<TSourceData, TTargetData> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> asyncMethod,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, TableAdjustment> syncmethod)
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(syncmethod, asyncMethod);
            handler.RegisterCommandHandler(EditCommand, del);
        }

    }
}
