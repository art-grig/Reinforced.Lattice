using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins
{
    public class ColumnPluginConfigurationWrapper<T,TColumn> : PluginConfigurationWrapper<T> where T : IProvidesColumnName, new()
    {
        public ColumnPluginConfigurationWrapper(PluginConfiguration config,string columnName) : base(config)
        {
            this.Configuration.ColumnName = columnName;
        }

        public ColumnPluginConfigurationWrapper(string pluginId, string columnName)
            : base(pluginId)
        {
            this.Configuration.ColumnName = columnName;
        }
    }
}
