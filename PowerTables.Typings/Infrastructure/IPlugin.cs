using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Typings.Infrastructure
{
    internal interface IPlugin : IRenderable
    {
        PluginConfiguration Configuration { get; }
        void Init(IPowerTable table, PluginConfiguration pluginConfiguration);
        bool IsToolbarPlugin { get; set; }
        bool IsQueryModifier { get; set; }
        bool IsRenderable { get; set; }
        string PluginId { get; set; }
    }
}
