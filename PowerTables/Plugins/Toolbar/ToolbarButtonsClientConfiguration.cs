using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarButtonsClientConfiguration
    {
        public List<ToolbarButtonClientConfiguration> Buttons { get; set; }

        public ToolbarButtonsClientConfiguration()
        {
            Buttons = new List<ToolbarButtonClientConfiguration>();
        }

    }
}
