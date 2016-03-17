using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Reinforced.Typings.Attributes;

namespace PowerTables.Typings.Infrastructure
{
    interface IRow
    {
        object DataObject { get; set; }
        int Index { get; set; }
        IPowerTable MasterTable { get; set; }
        [TsProperty(Type = "JQuery[]")]
        object Elements { get; set; }

        [TsProperty(Type = "JQuery")]
        object Element { get; set; }

        bool Fake { get; set; }
    }
}
