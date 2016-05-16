using System;

namespace PowerTables.Templating
{
    /// <summary>
    /// Overrides models field name for handlebars
    /// </summary>
    public class OverrideHbFieldNameAttribute : Attribute
    {
        /// <summary>
        /// Field name to be used in Handlebards
        /// </summary>
        public string Name { get; private set; }

        public OverrideHbFieldNameAttribute(string name)
        {
            Name = name;
        }
    }
}
