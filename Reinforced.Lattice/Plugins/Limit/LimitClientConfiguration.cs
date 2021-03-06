﻿using System.Collections.Generic;


namespace Reinforced.Lattice.Plugins.Limit
{
    /// <summary>
    /// Client configuration for Limit plugin. 
    /// See <see cref="LimitPluginExtensions"/>
    /// </summary>
    public class LimitClientConfiguration : IProvidesTemplate
    {
        /// <summary>
        /// Integer values for limit menu. By default set is equal to Corresponding labels
        /// </summary>
        public List<int> LimitValues { get; private set; }

        /// <summary>
        /// Values for limit menu. By default is { "All", "10", "50", "100" }
        /// </summary>
        public List<string> LimitLabels { get; private set; }

        public LimitClientConfiguration()
        {
            LimitLabels = new List<string>() { "All", "10", "50", "100" };
            LimitValues = new List<int>() { 0, 10, 50, 100 };
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
