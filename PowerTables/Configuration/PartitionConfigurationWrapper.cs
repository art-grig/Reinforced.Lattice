using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
{
    public class PartitionConfigurationWrapper
    {
        internal PartitionConfiguration Configuration { get; set; }

        public PartitionConfigurationWrapper(PartitionConfiguration configuration)
        {
            Configuration = configuration;
        }

        public PartitionConfigurationWrapper()
        {
            Configuration = new PartitionConfiguration();
        }
    }

    public static class PartitionConfigurationExtensions
    {
        public static PartitionConfigurationWrapper InitialSkipTake(this PartitionConfigurationWrapper conf, int skip = 0, int take = 0)
        {
            conf.Configuration.InitialSkip = skip;
            conf.Configuration.InitialTake = take;
            return conf;
        }

        public static PartitionConfigurationWrapper Client(this PartitionConfigurationWrapper conf)
        {
            conf.Configuration.Type = PartitionType.Client;
            return conf;
        }

        public static PartitionConfigurationWrapper Server(this PartitionConfigurationWrapper conf,int loadPagesAhead = 1, bool noCount = false)
        {
            conf.Configuration.Type = PartitionType.Server;
            conf.Configuration.LoadAhead = loadPagesAhead;
            conf.Configuration.NoCount = noCount;
            return conf;
        }
    }
}
