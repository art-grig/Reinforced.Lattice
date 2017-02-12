using System;
using System.Threading.Tasks;

namespace Reinforced.Lattice.Editing
{
    public static class EditCommandHandlerExtensions
    {
        public const string EditCommand = "Edit";

        public static void AddEditHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, TableAdjustment> method)
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(method);
            handler.RegisterCommandHandler(EditCommand, del);
        }

        public static void AddAsyncEditHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> method)
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(method);
            handler.RegisterCommandHandler(EditCommand, del);
        }

        public static void AddEditHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, Task<TableAdjustment>> asyncMethod,
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, TableAdjustment> syncmethod)
            where TTargetData : new()
        {
            var del = new EditorCommandHandler<TSourceData, TTargetData>(syncmethod, asyncMethod);
            handler.RegisterCommandHandler(EditCommand, del);
        }

    }
}