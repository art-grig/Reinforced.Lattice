using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Editors.PlainText
{
    public static class PlainTextEditorConfigurationExtensions
    {
        public static T EditPlainText<T>(this T t, Action<PlainTextEditorUiConfig> config = null) where T : IColumnConfigurator
        {
            t.TableConfigurator.TableConfiguration.UpdatePluginConfig<EditorUiConfig>(EditorExtensions.PluginId, c =>
            {
                var conf = new PlainTextEditorUiConfig();
                if (config != null) config(conf);
                c.Configuration.EditorsForColumns[t.ColumnConfiguration.RawColumnName] = conf;
            });

            return t;
        }
    }
}
