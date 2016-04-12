using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Templating;

namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarTemplateRegion : PluginTemplateRegion, IModelProvider<IToolbarViewModel>
    {
        public ToolbarTemplateRegion(IViewPlugins page) : base(page, "toolbar")
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface IToolbarViewModel
    {
        ToolbarButtonsClientConfiguration Configuration { get; }
    }

    public static class ToolbarTemplatingExtensions
    {
        public static ToolbarTemplateRegion Toolbar(this IViewPlugins t)
        {
            return new ToolbarTemplateRegion(t);
        }
    }

}
