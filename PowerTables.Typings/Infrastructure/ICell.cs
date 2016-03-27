using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Reinforced.Typings.Attributes;

namespace PowerTables.Typings.Infrastructure
{
    /// <summary>
    /// Cell object
    /// </summary>
    interface ICell : IRenderable
    {
        /// <summary>
        /// Associated row
        /// </summary>
        IRow Row { get; set; }

        /// <summary>
        /// Associated column
        /// </summary>
        IColumn Column { get; set; }

        /// <summary>
        /// Data for this specific cell
        /// </summary>
        object Data { get; set; }

        /// <summary>
        /// Whole data object associated with this specific cell
        /// </summary>
        object DataObject { get; set; }

        

    }
}
