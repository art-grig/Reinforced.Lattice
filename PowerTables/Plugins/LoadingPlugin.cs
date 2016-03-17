using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins
{
    public static class LoadingPlugin
    {
        public const string PluginId = "Loading";

        public static Configurator<TSourceData, TTableData> LoadingIndicator<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> c, PluginPosition position = PluginPosition.LeftTop) where TTableData : new()
        {
            c.TableConfiguration.ReplacePluginConfig(PluginId, null, position);
            return c;
        }
    }
}
