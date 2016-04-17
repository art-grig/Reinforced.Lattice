using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins
{
    public class PluginConfigurationWrapper<T> where T : new()
    {
        private readonly PluginConfiguration _config;
        private readonly T _genericConfig;
        public PluginConfigurationWrapper(PluginConfiguration config)
        {
            _config = config;
            _genericConfig = (T)config.Configuration;
            if (_genericConfig is IProvidesTemplate && string.IsNullOrEmpty(_config.TemplateId))
            {
                _config.TemplateId = ((IProvidesTemplate)_genericConfig).DefaultTemplateId;
            }
        }

        public PluginConfigurationWrapper(string pluginId)
        {
            _config = new PluginConfiguration(pluginId);
            _genericConfig = new T();
            if (_genericConfig is IProvidesTemplate)
            {
                _config.TemplateId = ((IProvidesTemplate) _genericConfig).DefaultTemplateId;
            }
            _config.Configuration = _genericConfig;
        } 

        public T Configuration { get { return _genericConfig; } }
        public int Order { get { return _config.Order; } set { _config.Order = value; } }
        public string Placement { get { return _config.Placement; } set { _config.Placement = value; } }
        public string TemplateId { get { return _config.TemplateId; } set { _config.TemplateId = value; } }
    }
}
