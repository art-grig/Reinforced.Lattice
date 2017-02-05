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

        public ServerPartitionConfiguration Server { get; set; }

        public ServerPartitionConfiguration Sequential { get; set; }
    }

    public class ServerPartitionConfiguration
    {
        public int LoadAhead { get; set; }

        public bool UseLoadMore { get; set; }

        public bool AppendLoadingRow { get; set; }

        public string LoadingRowTemplateId { get; set; }

        public ServerPartitionConfiguration()
        {
            LoadingRowTemplateId = "partitionIndication";
        }
    }



    public enum PartitionType
    {
        Client,
        Server, 
        Sequential
    }
}
