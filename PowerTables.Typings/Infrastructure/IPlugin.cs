using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Typings.Infrastructure
{
    /// <summary>
    /// Plugin interface
    /// </summary>
    internal interface IPlugin : IRenderable
    {
        /// <summary>
        /// Plugin configuration
        /// </summary>
        PluginConfiguration Configuration { get; }

        /// <summary>
        /// Initialization point of plugin
        /// </summary>
        /// <param name="table">Table reference</param>
        /// <param name="pluginConfiguration">Plugin configuration</param>
        void Init(IPowerTable table, PluginConfiguration pluginConfiguration);

        void RegisterHandlebarsHelpers(object handlebarsInstance);
        
        string PluginId { get; set; }
    }
}
