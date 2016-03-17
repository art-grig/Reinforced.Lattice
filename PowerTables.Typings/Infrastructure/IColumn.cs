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
        IFilter Filter { get; set; }
        [TsProperty(Type = "JQuery[]")]
        object Elements { get; set; }
        [TsProperty(Type = "JQuery")]
        object HeaderElement { get; set; }
        bool Fake { get; set; }
    }
}
