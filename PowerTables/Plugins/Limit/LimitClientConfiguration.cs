using System.Collections.Generic;


namespace PowerTables.Plugins.Limit
{
    /// <summary>
    /// Client configuration for Limit plugin. 
    /// See <see cref="LimitPluginExtensions"/>
    /// </summary>
    public class LimitClientConfiguration : IProvidesTemplate
    {
        /// <summary>
        /// Value selected by default
        /// </summary>
        public string DefaultValue { get; internal set; }

        /// <summary>
        /// Integer values for limit menu. By default set is equal to Corresponding labels
        /// </summary>
        public List<int> LimitValues { get; private set; }

        /// <summary>
        /// Values for limit menu. By default is { "All", "10", "50", "100" }
        /// </summary>
        public List<string> LimitLabels { get; private set; }

        /// <summary>
        /// When true, data will be re-queried on table change
        /// </summary>
        public bool ReloadTableOnLimitChange { get; set; }

        /// <summary>
        /// When true, limiting will not be passed to server. 
        /// All the limiting will be performed on client-side
        /// </summary>
        public bool EnableClientLimiting { get; set; }

        public LimitClientConfiguration()
        {
            LimitLabels = new List<string>() { "All", "10", "50", "100" };
            LimitValues = new List<int>() { 0, 10, 50, 100 };
            ReloadTableOnLimitChange = true;
        }

        /// <summary>
        /// Adds limit value
        /// </summary>
        /// <param name="limitLabel">Label</param>
        /// <param name="limitValue">Value</param>
        /// <returns></returns>
        public LimitClientConfiguration AddValue(string limitLabel, int limitValue)
        {
            LimitLabels.Add(limitLabel);
            LimitValues.Add(limitValue);
            return this;
        }

        public string DefaultTemplateId
        {
            get
            {
                return "limit";
            }
        }
    }
}
