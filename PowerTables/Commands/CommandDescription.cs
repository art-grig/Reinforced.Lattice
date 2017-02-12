using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using PowerTables.Editing;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Commands
{
    public class CommandDescription
    {
        public string Name { get; set; }
        public string ServerName { get; set; }

        public JRaw ClientFunction { get; set; }

        public JRaw ConfirmationDataFunction { get; set; }

        public JRaw CanExecute { get; set; }

        public CommandType Type { get; set; }

        public ConfirmationConfiguration Confirmation { get; set; }

        public JRaw OnSuccess { get; set; }
        public JRaw OnFailure { get; set; }
        public JRaw OnBeforeExecute { get; set; }
        
    }

    public class ConfirmationConfiguration
    {
        public string TemplateId { get; set; }

        public Dictionary<string,JRaw> TemplatePieces { get; set; }

        public string TargetSelector { get; set; }

        /// <summary>
        /// Gets or sets confirmation form fields configuration
        /// </summary>
        public List<FormwatchFieldData> Formwatch { get; set; }

        public CommandAutoformConfiguration Autoform { get; set; }

        public DetailLoadingConfiguration Details { get; set; }

        public JRaw ContentLoadingUrl { get; set; }

        public string ContentLoadingMethod { get; set; }

        public string ContentLoadingCommand { get; set; }

        public JRaw InitConfirmationObject { get; set; }
        public JRaw OnDismiss { get; set; }
        public JRaw OnCommit { get; set; }
        public JRaw OnContentLoaded { get; set; }
        public JRaw OnDetailsLoaded { get; set; }

        public ConfirmationConfiguration()
        {
            TemplatePieces = new Dictionary<string, JRaw>();
        }
    }

    public class CommandAutoformConfiguration
    {
        public List<EditFieldUiConfigBase> Autoform { get; set; }

        public bool DisableWhenContentLoading { get; set; }

        public bool DisableWhileDetailsLoading { get; set; }
    }

    public class DetailLoadingConfiguration
    {
        public string CommandName { get; set; }

        public string TempalteId { get; set; }

        public bool LoadImmediately { get; set; }

        public JRaw ValidateToLoad { get; set; }

        public JRaw DetailsFunction { get; set; }

        public int LoadDelay { get; set; }

        public bool LoadOnce { get; set; }

    }

    public enum CommandType
    {
        Client,
        Server
    }
}
