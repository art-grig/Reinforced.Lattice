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
        public string DefaultValue { get; set; }

        public List<int> LimitValues { get; private set; }

        public List<string> LimitLabels { get; private set; }

        public bool ReloadTableOnLimitChange { get; set; }

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
