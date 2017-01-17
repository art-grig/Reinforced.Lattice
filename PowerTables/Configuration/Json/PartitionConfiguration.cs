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

        public MixedPartitionConfiguration Mixed { get; set; }

        public int InitialSkip { get; set; }

        public int InitialTake { get; set; }

        public bool NoCount { get; set; }
    }

    //todo: do not use client ordering with mixed partition
    public class MixedPartitionConfiguration
    {
        public int LoadAhead { get; set; }

        public bool Rebuy { get; set; }
    }

    public enum PartitionType
    {
        Client,
        Server,
        Mixed
    }
}
