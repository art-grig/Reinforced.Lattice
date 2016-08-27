using Newtonsoft.Json;

namespace PowerTables.Plugins
{
    /// <summary>
    /// Plugin configuration that provides template ID overriding
    /// </summary>
    public interface IProvidesTemplate
    {
        /// <summary>
        /// Id for template that is used to draw plugin by default
        /// </summary>
        [JsonIgnore]
        string DefaultTemplateId { get; }
    }
}
