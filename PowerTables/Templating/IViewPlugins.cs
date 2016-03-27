using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Templating
{
    /// <summary>
    /// Views plugins classifier
    /// </summary>
    public interface IViewPlugins
    {
        /// <summary>
        /// Output view text writer
        /// </summary>
        TextWriter Writer { get; }

        /// <summary>
        /// Templates page model
        /// </summary>
        LatticeTemplatesViewModel Model { get; }
    }
}
