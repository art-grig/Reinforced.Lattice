using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Configuration.Json
{
    public class PartitionConfiguration
    {
        public PartitionType Type { get; set; }

        public int InitialSkip { get; set; }

        public int InitialTake { get; set; }

        public int LoadAhead { get; set; }

        public bool NoCount { get; set; }

    }

    

    public enum PartitionType
    {
        Client,
        Server
    }
}
