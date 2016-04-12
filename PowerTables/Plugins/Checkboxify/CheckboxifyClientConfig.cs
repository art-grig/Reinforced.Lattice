using System;


namespace PowerTables.Plugins.Checkboxify
{
    /// <summary>
    /// Client configuration for Checkboxify plugin. 
    /// See <see cref="CheckboxifyExtensions"/> 
    /// </summary>
    public class CheckboxifyClientConfig
    {
        public string SelectionColumnName { get; set; }
        
        public bool ResetOnReload { get; set; }

        public bool EnableSelectAll { get; set; }

        public bool SelectAllSelectsUndisplayedData { get; set; }

        public bool SelectAllOnlyIfAllData { get; set; }
       
    }
    
}
