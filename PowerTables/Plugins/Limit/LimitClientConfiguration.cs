using System;
using System.Collections.Generic;
using System.Linq;


namespace PowerTables.Plugins.Limit
{
    /// <summary>
    /// Client configuration for Limit plugin. 
    /// See <see cref="LimitPluginExtensions"/>
    /// </summary>
    public class LimitClientConfiguration 
    {
        /// <summary>
        /// Value selected by default
        /// </summary>
        public string DefaultValue { get; set; }

        /// <summary>
        /// List of limit values
        /// </summary>
        public List<int> LimitValues { get; private set; }

        /// <summary>
        /// List of corresponding limit labels
        /// </summary>
        public List<string> LimitLabels { get; private set; }

        public bool ReloadTableOnLimitChange { get; set; }

        /// <summary>
        /// When true, limiting will not be passed to server. 
        /// All the limiting will be performed on client-side
        /// </summary>
        public bool EnableClientLimiting { get; set; }

        public LimitClientConfiguration()
        {
            LimitLabels = new List<string>();
            LimitValues = new List<int>();
            ReloadTableOnLimitChange = true;
        }

        public LimitClientConfiguration AddValue(string limitLabel, int limitValue)
        {
            LimitLabels.Add(limitLabel);
            LimitValues.Add(limitValue);
            return this;
        }
    }
}
