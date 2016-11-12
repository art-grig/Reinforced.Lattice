using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;
using PowerTables.Plugins.Toolbar;

namespace PowerTables.Editing.Form
{
    public static class FormEditingExtensions
    {

        public const string PluginId = "FormEditHandler";

        public const string BeginDataSelector = "editform";

        public static Configurator<TSource, TTarget> EditingForm<TSource, TTarget>(
           this Configurator<TSource, TTarget> conf,
           Action<EditHandlerConfiguration<TTarget, FormEditUiConfig>> formConfig,
            Action<TableEventSubscription> beginFormEdit = null)
           where TTarget : new()
        {
            EditHandlerConfiguration<TTarget, FormEditUiConfig> eh = new EditHandlerConfiguration<TTarget, FormEditUiConfig>();
            formConfig(eh);
            conf.TableConfiguration.ReplacePluginConfig(PluginId, eh.FormClientConfig);
            TableEventSubscription begin = new TableEventSubscription();
            if (beginFormEdit != null)
            {
                beginFormEdit(begin);
            }
            else
            {
                begin.Event("click");
            }
            if (string.IsNullOrEmpty(begin.SubscriptionInfo.Selector))
            {
                begin.DataSelector(BeginDataSelector);
            }

            begin.HandleByPlugin(PluginId, "beginFormEditHandler");
            conf.SubscribeRowEvent(begin);
            return conf;
        }

        public static EditHandlerConfiguration<TTarget, FormEditUiConfig> RenderTo<TTarget>(
            this EditHandlerConfiguration<TTarget, FormEditUiConfig> conf, string targetSelector, string formTemplateId = null)
        {
            if (!string.IsNullOrEmpty(formTemplateId)) conf.FormClientConfig.FormTemplateId = formTemplateId;
            conf.FormClientConfig.FormTargetSelector = targetSelector;
            return conf;
        }

        public static Template FormEditTrigger(this Template t)
        {
            return t.Data(BeginDataSelector, "true");
        }

        public static ToolbarItemBuilder AddNewByForm(this ToolbarItemBuilder tib)
        {
            tib.OnClick(string.Format("function (a) {{ a.InstanceManager.getPlugin('{0}').add(); }}", PluginId));
            return tib;
        }
    }
}
