using System;
using Newtonsoft.Json.Linq;


namespace PowerTables.Plugins.Checkboxify
{
    /// <summary>
    /// Client configuration for Checkboxify plugin. 
    /// See <see cref="CheckboxifyExtensions"/> 
    /// </summary>
    public class CheckboxifyClientConfig
    {
        public string SelectionColumnName { get; internal set; }

        public bool ResetOnReload { get; internal set; }

        public bool EnableSelectAll { get; internal set; }

        public bool SelectAllSelectsServerUndisplayedData { get; internal set; }

        public bool SelectAllSelectsClientUndisplayedData { get; internal set; }

        public bool SelectAllOnlyIfAllData { get; internal set; }

        public bool ResetOnClientReload { get; internal set; }

        public string SelectAllTemplateId { get; set; }

        public string RowTemplateId { get; set; }

        public string CellTemplateId { get; set; }

        public JRaw CanSelectFunction { get; set; }

        public CheckboxifyClientConfig()
        {
            SelectAllTemplateId = "checkboxifySelectAll";
            RowTemplateId = "checkboxifyRow";
            CellTemplateId = "checkboxifyCell";
        }
    }

}
