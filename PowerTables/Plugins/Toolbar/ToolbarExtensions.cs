using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Razor.Tokenizer;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Toolbar
{
    public static class ToolbarExtensions
    {
        public const string PluginId = "Toolbar";

        public static T Toolbar<T>(this T conf, string position, Action<ToolbarBuilder> toolbar) where T : IConfigurator
        {
            ToolbarBuilder tb = new ToolbarBuilder();
            toolbar(tb);
            var btnsConfig =  new ToolbarButtonsClientConfiguration()
            {
                Buttons = tb.Buttons.ToList()
            };
            conf.TableConfiguration.ReplacePluginConfig(PluginId,btnsConfig,position);
            return conf;
        }
    }
}
