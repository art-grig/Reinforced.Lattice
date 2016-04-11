using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
{
    class PluginConfigurationWrapper<T> : IPluginConfiguration<T> where T : new()
    {
        private readonly PluginConfiguration _config;
        private readonly T _genericConfig;
        public PluginConfigurationWrapper(PluginConfiguration config)
        {
            _config = config;
            _genericConfig = (T)config.Configuration;
        }

        public PluginConfigurationWrapper(string pluginId)
        {
            _config = new PluginConfiguration(pluginId);
            _genericConfig = new T();
            _config.Configuration = _genericConfig;
        } 

        public T Configuration { get { return _genericConfig; } }
        public int Order { get { return _config.Order; } set { _config.Order = value; } }
        public string Placement { get { return _config.Placement; } set { _config.Placement = value; } }
    }
}
