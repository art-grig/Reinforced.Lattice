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
        string RawName { get; set; }
        ColumnConfiguration Configuration { get; set; }
        IPowerTable MasterTable { get; set; }
        IColumnHeader Header { get; set; }
    }
}
