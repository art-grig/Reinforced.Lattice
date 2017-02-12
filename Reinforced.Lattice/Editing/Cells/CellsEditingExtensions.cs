using System;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Editing.Cells
{
    public static class CellsEditingExtensions
    {
        public const string PluginId = "CellsEditHandler";

        public const string DataSelector = "editcell";

        public static Configurator<TSource, TTarget> EditingCells<TSource, TTarget>(
           this Configurator<TSource, TTarget> conf,
           Action<EditHandlerConfiguration<TTarget, CellsEditUiConfig>> celsEditorConfig,
            Action<TableEventSubscription> startCellEditingAction = null)
           where TTarget : new()
        {
            EditHandlerConfiguration<TTarget, CellsEditUiConfig> eh = new EditHandlerConfiguration<TTarget, CellsEditUiConfig>();
            celsEditorConfig(eh);
            

           
            foreach (var editFieldUiConfigBase in eh.FormClientConfig.Fields)
            {
                TableEventSubscription tes = new TableEventSubscription();
                if (startCellEditingAction != null)
                {
                    startCellEditingAction(tes);
                }
                else
                {
                    tes.Event("click");
                }

                tes.Handler(string.Format("function(e) {{ e.Master.InstanceManager.getPlugin('{0}').beginCellEditHandle(e); }}", PluginId));
                tes.DataSelector(DataSelector);
                conf.SubscribeCellEvent(editFieldUiConfigBase.FieldName, tes);
            }

            conf.TableConfiguration.ReplacePluginConfig(PluginId, eh.FormClientConfig);
            return conf;
        }

        public static Template CellEditTrigger(this Template t)
        {
            return t.Data(DataSelector, "true");
        }

    }
}
