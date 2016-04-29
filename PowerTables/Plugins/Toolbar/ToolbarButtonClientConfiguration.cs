using System.Collections.Generic;

using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarButtonClientConfiguration
    {
        public string Id { get; set; }

        public string Css { get; set; }

        public string Style { get; set; }

        public string HtmlContent { get; set; }

        public string Command { get; set; }

        public bool BlackoutWhileCommand { get; set; }

        public bool DisableIfNothingChecked { get; set; }

        public string Title { get; set; }

        /// <summary>
        /// Function (table:PowerTables.PowerTable, response:IPowerTablesResponse) => void
        /// </summary>
        public JRaw CommandCallbackFunction { get; set; }

        /// <summary>
        /// Function (continuation: ( queryModifier?:(a:IQuery) => IQuery ) => void ) => void
        /// </summary>
        public JRaw ConfirmationFunction { get; set; }

        /// <summary>
        /// Function (table:any (PowerTables.PowerTable), menuElement:any)=>void
        /// </summary>
        public JRaw OnClick { get; set; }

        public List<ToolbarButtonClientConfiguration> Submenu { get; set; }

        public bool HasSubmenu { get { return Submenu.Count > 0; } }

        public ToolbarButtonClientConfiguration()
        {
            Submenu = new List<ToolbarButtonClientConfiguration>();
        }

        public bool IsMenu { get; set; }

        public bool Separator { get; set; }

        public int InternalId { get; set; }

        public bool IsDisabled { get; set; }

        public string ConfirmationTemplateId { get; set; }

        public string ConfirmationTargetSelector { get; set; }
    }
}