using System;
using System.Threading.Tasks;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Defaults;
using PowerTables.Editors;
using PowerTables.Filters;
using PowerTables.Filters.Select;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Plugins.Hierarchy
{
    public static class HierarchyExtensions
    {
        public const string PluginId = "Hierarchy";

        public const string GetChildrenCommand = "GetHierarchyChildren";

        private const string CurrentItemAdditionalDataKey = "HierarchyParent";

        public static Configurator<TSource, TTarget> Hierarchy<TSource, TTarget>(
            this Configurator<TSource, TTarget> conf, Action<PluginConfigurationWrapper<HierarchyUiConfiguration>> ui = null, Action<TableEventSubscription> expandEvent = null, Action<TableEventSubscription> collapseEvent = null, Action<TableEventSubscription> toogleEvent = null) where TTarget : IHierarchyItem, new()
        {
            conf.TableConfiguration.UpdatePluginConfig(PluginId, ui);
            conf.Column(c => c.ChildrenCount).DataOnly();
            conf.Column(c => c.IsVisible).DataOnly();
            conf.Column(c => c.IsVisible).FilterBooleanUi("1", "0", ui: f => f.SelectDefault(true).ClientFiltering());
            conf.Column(c => c.IsExpanded).DataOnly();
            conf.Column(c => c.RootKey).DataOnly();
            conf.Column(c => c.ParentKey).DataOnly();
            conf.Column(c => c.TreeOrder).DataOnly();
            conf.Column(c => c.Deepness).DataOnly();
            conf.Column(c => c.IsLoading).DataOnly();
            
            TableEventSubscription collapse = new TableEventSubscription();
            collapse.Event("click");
            collapse.DataSelector("collapsehierarchy");
            collapse.Handler("function(e) { e.Master.InstanceManager.getPlugin('Hierarchy').collapseSubtree(e); }");
            if (collapseEvent != null) collapseEvent(collapse);

            TableEventSubscription expand = new TableEventSubscription();
            expand.Event("click");
            expand.DataSelector("expandhierarchy");
            expand.Handler("function(e) { e.Master.InstanceManager.getPlugin('Hierarchy').expandSubtree(e); }");
            if (expandEvent != null) expandEvent(expand);

            TableEventSubscription toggle = new TableEventSubscription();
            toggle.Event("click");
            toggle.DataSelector("togglehierarchy");
            toggle.Handler("function(e) { e.Master.InstanceManager.getPlugin('Hierarchy').toggleSubtree(e); }");
            if (toogleEvent != null) toogleEvent(toggle);

            conf.SubscribeRowEvent(collapse);
            conf.SubscribeRowEvent(expand);
            conf.SubscribeRowEvent(toggle);

            return conf;
        }


        public static Template CollapseSubtree(this Template tpl)
        {
            tpl.Data("collapsehierarchy", "true");
            return tpl;
        }

        public static Template ExpandSubtree(this Template tpl)
        {
            tpl.Data("expandhierarchy", "true");
            return tpl;
        }

        public static Template ToggleSubtree(this Template tpl)
        {
            tpl.Data("togglehierarchy", "true");
            return tpl;
        }


        public static void AddGetChildrenHandler<TSourceData, TTargetData>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, string,HierarchyChildrenResult> method)
            where TTargetData : new()
        {
            handler.AddCommandHandler(GetChildrenCommand, data =>
            {
                var selectedItem = data.Request.RetrieveAdditionalObject<string>(CurrentItemAdditionalDataKey);
                return method(data, selectedItem);
            });
            
        }

        public static void AddGetChildrenAsyncHandler<TSourceData, TTargetData>(
            this PowerTablesHandler<TSourceData, TTargetData> handler,
            Func<PowerTablesData<TSourceData, TTargetData>, string, Task<HierarchyChildrenResult>> method)
            where TTargetData : new()
        {
            handler.AddCommandHandler(GetChildrenCommand, async data =>
            {
                var selectedItem = data.Request.RetrieveAdditionalObject<string>(CurrentItemAdditionalDataKey);
                return await method(data, selectedItem);
            });
        }
    }
}
