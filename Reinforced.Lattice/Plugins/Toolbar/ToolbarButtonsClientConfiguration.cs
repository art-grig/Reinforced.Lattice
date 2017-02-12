using System.Collections.Generic;


namespace Reinforced.Lattice.Plugins.Toolbar
{
    public class ToolbarButtonsClientConfiguration : IProvidesTemplate
    {
        public List<ToolbarButtonClientConfiguration> Buttons { get; set; }

        public ToolbarButtonsClientConfiguration()
        {
            Buttons = new List<ToolbarButtonClientConfiguration>();
        }

        public string DefaultTemplateId { get { return "toolbar"; } }
    }
}
