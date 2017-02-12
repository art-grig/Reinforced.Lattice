using System;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;
using Reinforced.Lattice.Plugins.Toolbar;

namespace Reinforced.Lattice.Editing.Rows
{
    public static class RowsEditingExtensions
    {

        public const string PluginId = "RowsEditHandler";

        public const string BeginDataSelector = "editrow";
        public const string CommitDataSelector = "commitrow";
        public const string RejectDataSelector = "rejectrow";


        public static Configurator<TSource, TTarget> EditingRow<TSource, TTarget>(
            this Configurator<TSource, TTarget> conf,
            Action<EditHandlerConfiguration<TTarget, RowsEditUiConfig>> celsEditorConfig,
            Action<TableEventSubscription> beginRowEdit = null,
            Action<TableEventSubscription> commitRowEdit = null,
            Action<TableEventSubscription> rejectRowEdit = null
            )
            where TTarget : new()
        {
            EditHandlerConfiguration<TTarget, RowsEditUiConfig> eh = new EditHandlerConfiguration<TTarget, RowsEditUiConfig>();
            celsEditorConfig(eh);
            conf.TableConfiguration.ReplacePluginConfig(PluginId, eh.FormClientConfig);
            SubscribeRowEdit(conf, "beginRowEditHandle", beginRowEdit, BeginDataSelector);
            SubscribeRowEdit(conf, "commitRowEditHandle", commitRowEdit, CommitDataSelector);
            SubscribeRowEdit(conf, "rejectRowEditHandle", rejectRowEdit, RejectDataSelector);
            return conf;
        }

        private static void SubscribeRowEdit(IConfigurator conf, string functionName, Action<TableEventSubscription> act, string defaultSelector)
        {
            TableEventSubscription begin = new TableEventSubscription();
            if (act != null)
            {
                act(begin);
            }
            else
            {
                begin.Event("click");
            }
            if (string.IsNullOrEmpty(begin.SubscriptionInfo.Selector))
            {
                begin.DataSelector(defaultSelector);
            }

            begin.Handler(string.Format("function(e) {{ e.Master.InstanceManager.getPlugin('{0}').{1}(e); }}", PluginId, functionName));
            conf.SubscribeRowEvent(begin);
        }

        public static Template RowEditTrigger(this Template t)
        {
            return t.Data(BeginDataSelector, "true");
        }

        public static Template RowCommitTrigger(this Template t)
        {
            return t.Data(CommitDataSelector, "true");
        }

        public static Template RowRejectTrigger(this Template t)
        {
            return t.Data(RejectDataSelector, "true");
        }

        public static ToolbarItemBuilder AddNewByRow(this ToolbarItemBuilder tib)
        {
            tib.OnClick(string.Format("function (a) {{ a.InstanceManager.getPlugin('{0}').add(); }}", PluginId));
            return tib;
        }
    }
}
