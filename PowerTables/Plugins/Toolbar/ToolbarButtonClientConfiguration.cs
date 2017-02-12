using System.Collections.Generic;

using Newtonsoft.Json.Linq;

namespace Reinforced.Lattice.Plugins.Toolbar
{
    /// <summary>
    /// JSON configuration for toolbar button
    /// </summary>
    public class ToolbarButtonClientConfiguration
    {
        /// <summary>
        /// Gets or sets value of button's 'id' HTML attribute value
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets value of button's 'class' HTML attribute value
        /// </summary>
        public string Css { get; set; }

        /// <summary>
        /// Gets or sets value of button's 'style' HTML attribute value
        /// </summary>
        public string Style { get; set; }

        /// <summary>
        /// Gets or sets button's inner HTML
        /// </summary>
        public string HtmlContent { get; set; }

        /// <summary>
        /// Gets or sets command associated within this button
        /// </summary>
        public string Command { get; set; }

        /// <summary>
        /// When true, button/menu item will be disabled while command is being executed
        /// </summary>
        public bool BlackoutWhileCommand { get; set; }

        /// <summary>
        /// Button will be disabled when nothing is checked within checkboxify plugin
        /// </summary>
        public bool DisableIfNothingChecked { get; set; }

        /// <summary>
        /// Button title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets JS function to be executed on button click. JS function is of type: (table:any (Reinforced.Lattice.PowerTable), menuElement:any)=>void
        /// </summary>
        public JRaw OnClick { get; set; }

        /// <summary>
        /// Collection of button's submenu items
        /// </summary>
        public List<ToolbarButtonClientConfiguration> Submenu { get; set; }

        /// <summary>
        /// Gets value indicating where button has submenu items
        /// </summary>
        public bool HasSubmenu { get { return Submenu.Count > 0; } }

        /// <summary>
        /// Default constructor
        /// </summary>
        public ToolbarButtonClientConfiguration()
        {
            Submenu = new List<ToolbarButtonClientConfiguration>();
        }

        /// <summary>
        /// Gets or sets value indicating whether button is menu holder 
        /// </summary>
        public bool IsMenu { get; set; }

        /// <summary>
        /// Gets or sets value indicating whether button is separator 
        /// </summary>
        public bool Separator { get; set; }

        /// <summary>
        /// Gets button id that is used internally
        /// </summary>
        public int InternalId { get; internal set; }

        /// <summary>
        /// Gets or sets value indicating whether button is disabled 
        /// </summary>
        public bool IsDisabled { get; set; }
        
    }
}