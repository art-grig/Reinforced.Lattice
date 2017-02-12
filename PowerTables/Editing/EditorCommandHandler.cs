using System;
using System.Threading.Tasks;
using PowerTables.Processing;

namespace PowerTables.Editing
{
    class EditorCommandHandler<TSourceData, TTargetData> : CommandHandleBase<TableAdjustment> where TTargetData : new()
    {
        public const string EditAdditionalDataKey = "Edit";

        private readonly Func<LatticeData<TSourceData, TTargetData>, TTargetData, TableAdjustment> _handlerMethod;
        private readonly Func<LatticeData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> _asynchandlerMethod;

        public EditorCommandHandler(Func<LatticeData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> asynchandlerMethod, bool forceDeferred = false)
        {
            _asynchandlerMethod = asynchandlerMethod;
        }

        public EditorCommandHandler(Func<LatticeData<TSourceData, TTargetData>, TTargetData, TableAdjustment> handlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
        }

        public EditorCommandHandler(Func<LatticeData<TSourceData, TTargetData>, TTargetData, TableAdjustment> handlerMethod, Func<LatticeData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> asynchandlerMethod, bool forceDeferred = false)
        {
            _handlerMethod = handlerMethod;
            _asynchandlerMethod = asynchandlerMethod;
        }

        protected override TableAdjustment Handle(LatticeData data)
        {
            if (_handlerMethod == null)
            {
                throw new Exception("This is asynchronous command handler. Please use it with .HandleAsync, not .Handle.");
            }

            LatticeData<TSourceData, TTargetData> typedData = new LatticeData<TSourceData, TTargetData>(data);

            var update = _handlerMethod(typedData, data.Request.RetrieveAdditionalObject<TTargetData>(EditAdditionalDataKey));
            return update;
        }

        protected override async Task<TableAdjustment> HandleAsync(LatticeData data)
        {
            LatticeData<TSourceData, TTargetData> typedData = new LatticeData<TSourceData, TTargetData>(data);
            var edited = data.Request.RetrieveAdditionalObject<TTargetData>(EditAdditionalDataKey);
            TableAdjustment result = null;

            if (_asynchandlerMethod != null) result = await _asynchandlerMethod(typedData, edited).ConfigureAwait(false);
            else result = _handlerMethod(typedData, edited);
            return result;
        }
    }
}
