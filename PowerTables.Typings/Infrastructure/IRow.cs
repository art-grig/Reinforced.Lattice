using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Reinforced.Typings.Attributes;

namespace PowerTables.Typings.Infrastructure
{
    /// <summary>
    /// Row object
    /// </summary>
    interface IRow : IRenderable
    {
        /// <summary>
        /// Data object for row
        /// </summary>
        object DataObject { get; set; }

        /// <summary>
        /// Zero-based row idnex
        /// </summary>
        int Index { get; set; }

        /// <summary>
        /// Table reference
        /// </summary>
        IPowerTable MasterTable { get; set; }

        Dictionary<string, ICell> Cells { get; set; }
    }
}
