using System;

namespace Reinforced.Lattice.Templates
{
    /// <summary>
    /// Overrides models field name for handlebars
    /// </summary>
    public class OverrideTplFieldNameAttribute : Attribute
    {
        /// <summary>
        /// Field name to be used in Handlebards
        /// </summary>
        public string Name { get; private set; }

        public OverrideTplFieldNameAttribute(string name)
        {
            Name = name;
        }
    }
}
