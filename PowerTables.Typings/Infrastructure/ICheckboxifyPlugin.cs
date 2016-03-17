using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Typings.Infrastructure
{
    /// <summary>
    /// Interface of checkboxify plugin. 
    /// Plugin id is "Checkboxify"
    /// </summary>
    interface ICheckboxifyPlugin
    {
        /// <summary>
        /// Retrieves array of checked items ids
        /// </summary>
        /// <param name="_"></param>
        /// <returns>Array of ids</returns>
        string[] GetSelection();

        /// <summary>
        /// Selects or deselects all elements based on parameter
        /// </summary>
        /// <param name="select">When true, all elements will be selected. No ones otherwise</param>
        void SelectAll(bool select);

        ///<summary>
        /// Resets all the table selection
        ///</summary>
        /// <param name="_"></param>
        void ResetSelection();

        /// <summary>
        /// Selects or deselects item with specified Id
        /// </summary>
        /// <param name="itemId">Item Id to select</param>
        /// <param name="selected">True to select, false to reset selection</param>
        void SelectItem(string itemId, bool selected);
    }
}
