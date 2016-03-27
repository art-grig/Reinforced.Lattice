using System;

namespace PowerTables.Templating
{
    /// <summary>
    /// Overrides models field name for handlebars
    /// </summary>
    public class OverrideHbFieldNameAttribute : Attribute
    {
        public string Name { get; private set; }

        public OverrideHbFieldNameAttribute(string name)
        {
            Name = name;
        }
    }
}
