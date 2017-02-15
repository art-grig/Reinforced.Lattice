using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Reinforced.Lattice.Adjustments;
using Reinforced.Lattice.Commands;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;
using Reinforced.Lattice.Processing;

namespace Reinforced.Lattice.Plugins.Hierarchy
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

        public static ColumnUsage<TSource, TTarget, TCol> BindHierarchyExpand<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget,TCol> conf, DOMEvent evt, string selector) where TTarget: IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "expandRow").Selector(selector));
            return conf;
        }

        public static ColumnUsage<TSource, TTarget, TCol> BindHierarchyCollapse<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget, TCol> conf, DOMEvent evt, string selector) where TTarget : IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "collapseRow").Selector(selector));
            return conf;
        }

        public static ColumnUsage<TSource, TTarget, TCol> BindHierarchyToggle<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget, TCol> conf, DOMEvent evt, string selector) where TTarget : IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "toggleRow").Selector(selector));
            return conf;
        }

        public static ColumnUsage<TSource, TTarget, TCol> BindHierarchyLoad<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget, TCol> conf, DOMEvent evt, string selector) where TTarget : IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "expandLoadRow").Selector(selector));
            return conf;
        }

        public static ColumnUsage<TSource, TTarget, TCol> BindHierarchyToggleLoad<TSource, TTarget, TCol>(this ColumnUsage<TSource, TTarget, TCol> conf, DOMEvent evt, string selector) where TTarget : IHierarchyItem, new()
        {
            conf.SubscribeCellEvent(x => x.StreamEventToPlugin(evt, PluginId, "toggleLoadRow").Selector(selector));
            return conf;
        }

        public static T BindHierarchyExpand<T>(this T conf, DOMEvent evt, string selector) where T : IConfigurator, new()
        {
            conf.SubscribeRowEvent(x => x.StreamEventToPlugin(evt, PluginId, "expandRow").Selector(selector));
            return conf;
        }

        public static T BindHierarchyCollapse<T>(this T conf, DOMEvent evt, string selector) where T : IConfigurator, new()
        {
            conf.SubscribeRowEvent(x => x.StreamEventToPlugin(evt, PluginId, "collapseRow").Selector(selector));
            return conf;
        }

        public static T BindHierarchyToggle<T>(this T conf, DOMEvent evt, string selector) where T : IConfigurator, new()
        {
            conf.SubscribeRowEvent(x => x.StreamEventToPlugin(evt, PluginId, "toggleRow").Selector(selector));
            return conf;
        }

        public static T BindHierarchyLoad<T>(this T conf, DOMEvent evt, string selector) where T : IConfigurator, new()
        {
            conf.SubscribeRowEvent(x => x.StreamEventToPlugin(evt, PluginId, "expandLoadRow").Selector(selector));
            return conf;
        }

        public static T BindHierarchyToggleLoad<T>(this T conf, DOMEvent evt, string selector) where T : IConfigurator, new()
        {
            conf.SubscribeRowEvent(x => x.StreamEventToPlugin(evt, PluginId, "toggleLoadRow").Selector(selector));
            return conf;
        }



        public static void AddChildrenRowHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, IEnumerable<TTargetData>> method)
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
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, IEnumerable<TSourceData>> method)
            where TTargetData : IHierarchyItem, new()
        {
            handler.AddCommandHandler(GetChildrenCommand, data =>
            {
                var subject = data.CommandSubject();
                var result = method(data, subject);
                return data.Adjust(x => x.Update(result));
            });

        }

#if ASYNC
        public static void AddAsyncChildrenRowHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, Task<IEnumerable<TTargetData>>> method)
            where TTargetData : IHierarchyItem, new()
        {
            handler.AddCommandHandler(GetChildrenCommand, async data =>
            {
                var subject = data.CommandSubject();
                var result = await method(data, subject);
                return data.Adjust(x => x.Update(result));
            });

        }

        public static void AddAsyncChildrenHandler<TSourceData, TTargetData, TResponse>(
            this RequestHandlerBase<TSourceData, TTargetData, TResponse> handler,
            Func<LatticeData<TSourceData, TTargetData>, TTargetData, Task<IEnumerable<TSourceData>>> method)
            where TTargetData : IHierarchyItem, new()
        {
            handler.AddCommandHandler(GetChildrenCommand, async data =>
            {
                var subject = data.CommandSubject();
                var result = await method(data, subject);
                return data.Adjust(x => x.Update(result));
            });

        }
#endif
    }
}
