using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;
using Reinforced.Typings.Attributes;

namespace PowerTables.Typings.Infrastructure
{
    interface IColumn
    {
        /// <summary>
        /// Raw column name
        /// </summary>
        string RawName { get; set; }

        /// <summary>
        /// Column configuration
        /// </summary>
        ColumnConfiguration Configuration { get; set; }

        /// <summary>
        /// Reference to master table
        /// </summary>
        [TsProperty(Type = "PowerTables.IPowerTable")]
        object MasterTable { get; set; }

        /// <summary>
        /// Column header
        /// </summary>
        IColumnHeader Header { get; set; }

        /// <summary>
        /// Column order (left-to-right)
        /// </summary>
        int Order { get; set; }
    }
}
