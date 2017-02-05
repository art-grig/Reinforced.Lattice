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

        public static PartitionConfigurationWrapper Server(this PartitionConfigurationWrapper c,int loadPagesAhead = 2, bool noCount = false,
            Action<ServerPartitionConfigurationWrapper> conf = null)
        {
            c.Configuration.Server = new ServerPartitionConfiguration();
            c.Configuration.Type = PartitionType.Server;
            c.Configuration.Server.LoadAhead = loadPagesAhead;
            c.Configuration.Server.NoCount = noCount;
            if (conf != null)
            {
                ServerPartitionConfigurationWrapper w = new ServerPartitionConfigurationWrapper(c.Configuration.Server);
                conf(w);
            }
            return c;
        }
    }
}
