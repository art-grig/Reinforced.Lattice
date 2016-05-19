using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.Checkboxify
{
    /// <summary>
    /// Additional JSON data that instructs client side what selection should be set
    /// </summary>
    public class SelectionAdditionalData
    {
        /// <summary>
        /// When true, selection on table will be replaced with <see cref="SelectionToReplace"/>
        /// </summary>
        public bool ReplaceSelection { get; set; }

        /// <summary>
        /// Object IDs that must be selected instead of existing selection
        /// </summary>
        public string[] SelectionToReplace { get; set; }

        /// <summary>
        /// When true, selection on table will be modified 
        /// </summary>
        public bool ModifySelection { get; set; }

        /// <summary>
        /// Adds specified keys to selection
        /// </summary>
        public string[] AddToSelection { get; set; }

        /// <summary>
        /// Removes specified keys from selection
        /// </summary>
        public string[] RemoveFromSelection { get; set; }
    }
}
