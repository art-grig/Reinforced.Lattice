using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins
{
    /// <summary>
    /// Column-powered UI configuration
    /// </summary>
    public interface IProvidesColumnName
    {
        /// <summary>
        /// Column name
        /// </summary>
        string ColumnName { get; set; }
    }
}
