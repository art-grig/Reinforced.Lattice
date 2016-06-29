using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Plugins.RowAction
{
    /// <summary>
    /// JSON configuration for client row action
    /// </summary>
    public class ClientRowActionDescription
    {
        /// <summary>
        /// Gets or sets command associated within client action
        /// </summary>
        public string Command { get; set; }

        /// <summary>
        /// Gets or sets template ID for confirmation button's action
        /// </summary>
        public string ConfirmationTemplateId { get; set; }

        /// <summary>
        /// Gets or sets element selector where confirmation panel will be placed to
        /// </summary>
        public string ConfirmationTargetSelector { get; set; }

        /// <summary>
        /// Gets or sets confirmation form fields configuration
        /// </summary>
        public List<FormwatchFieldData> ConfirmationFormConfiguration { get; set; }

        /// <summary>
        /// Gets or sets JS function to be executed after command execution. JS function is of type: (table:PowerTables.PowerTable, response:IPowerTablesResponse) => void
        /// </summary>
        public JRaw CommandCallbackFunction { get; set; }

        /// <summary>
        /// Gets or sets JS function to be executed before command execution with ability to confinue or reject action. JS function is of type: (continuation: ( queryModifier?:(a:IQuery) => IQuery ) => void ,table:any (PowerTables.PowerTable)) => void
        /// </summary>
        public JRaw ConfirmationFunction { get; set; }

        /// <summary>
        /// Gets or sets JS function to be executed when action happens. JS function is of type: (table:any (PowerTables.PowerTable), menuElement:any)=>void
        /// </summary>
        public JRaw OnTrigger { get; set; }

        /// <summary>
        /// Gets or sets URL that HTML content will be loaded from for particular row
        /// </summary>
        public string UrlToLoad { get; set; }
    }
}
