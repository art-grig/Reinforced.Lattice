using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using PowerTables.Adjustments;
using PowerTables.CellTemplating;
using PowerTables.Commands;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Processing;
using PowerTables.Templating;

namespace PowerTables.Plugins.Hierarchy
{
    public static class HierarchyExtensions
    {
        public const string PluginId = "Hierarchy";

        public const string GetChildrenCommand = "_Children";

        public static Configurator<TSource, TTarget> Hierarchy<TSource, TTarget, T2>(
            this Configurator<TSource, TTarget> conf,
            Expression<Func<TTarget, T2>> parentKeyExpression,
            Action<PluginConfigurationWrapper<HierarchyUiConfiguration>> ui = null) where TTarget : IHierarchyItem, new()
        {
            conf.TableConfiguration.UpdatePluginConfig<HierarchyUiConfiguration>(PluginId, u =>
            {
                u.Configuration.ParentKeyFields = LambdaHelpers.ExtractColumnsList(parentKeyExpression);
                if (ui != null) ui(u);
            });
            conf.Column(c => c.ChildrenCount).DataOnly();
            conf.Column(c => c.IsExpanded).DataOnly();
            return conf;
        }

        public static ColumnUsage<TSource, TTarget, TCol> ExpandEvent<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget,TCol> conf, DOMEvent evt, string selector) where TTarget: IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "expandRow").Selector(selector));
            return conf;
        }

        public static ColumnUsage<TSource, TTarget, TCol> CollapseEvent<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget, TCol> conf, DOMEvent evt, string selector) where TTarget : IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "collapseRow").Selector(selector));
            return conf;
        }

        public static ColumnUsage<TSource, TTarget, TCol> ToggleEvent<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget, TCol> conf, DOMEvent evt, string selector) where TTarget : IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "toggleRow").Selector(selector));
            return conf;
        }


        public static void AddChildrenHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, IEnumerable<TTargetData>> method)
            where TTargetData : IHierarchyItem, new()
        {
            handler.AddCommandHandler(GetChildrenCommand, data =>
            {
                var subject = data.CommandSubject();
                var result = method(data, subject);
                return data.Adjust(x => x.Update(result));
            });

        }

        public static void AddChildrenHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, IEnumerable<TSourceData>> method)
            where TTargetData : IHierarchyItem, new()
        {
            handler.AddCommandHandler(GetChildrenCommand, data =>
            {
                var subject = data.CommandSubject();
                var result = method(data, subject);
                return data.Adjust(x => x.Update(result));
            });

        }

        public static void AddChildrenHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, Task<IEnumerable<TTargetData>>> method)
            where TTargetData : IHierarchyItem, new()
        {
            handler.AddCommandHandler(GetChildrenCommand, async data =>
            {
                var subject = data.CommandSubject();
                var result = await method(data, subject);
                return data.Adjust(x => x.Update(result));
            });

        }

        public static void AddChildrenHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, TTargetData, Task<IEnumerable<TSourceData>>> method)
            where TTargetData : IHierarchyItem, new()
        {
            handler.AddCommandHandler(GetChildrenCommand, async data =>
            {
                var subject = data.CommandSubject();
                var result = await method(data, subject);
                return data.Adjust(x => x.Update(result));
            });

        }
    }
}
