using System;
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

        public static PartitionConfigurationWrapper Server(this PartitionConfigurationWrapper c, int loadPagesAhead = 2,
            Action<ServerPartitionConfigurationWrapper> conf = null, Action<ServerPartitionConfigurationWrapper> ifClientSearch = null)
        {
            c.Configuration.Server = new ServerPartitionConfiguration();
            c.Configuration.Sequential = new ServerPartitionConfiguration();

            c.Configuration.Type = PartitionType.Server;
            c.Configuration.Server.LoadAhead = loadPagesAhead;
            c.Configuration.Sequential.LoadAhead = loadPagesAhead;
            if (conf != null)
            {
                ServerPartitionConfigurationWrapper w = new ServerPartitionConfigurationWrapper(c.Configuration.Server);
                conf(w);
                ServerPartitionConfigurationWrapper w2 = new ServerPartitionConfigurationWrapper(c.Configuration.Sequential);
                conf(w2);
            }
            if (ifClientSearch != null)
            {
                ServerPartitionConfigurationWrapper w = new ServerPartitionConfigurationWrapper(c.Configuration.Sequential);
                ifClientSearch(w);
            }
            return c;
        }

        public static PartitionConfigurationWrapper Sequential(this PartitionConfigurationWrapper c, int loadPagesAhead = 2,
            Action<ServerPartitionConfigurationWrapper> conf = null)
        {
            c.Configuration.Sequential = new ServerPartitionConfiguration();
            c.Configuration.Type = PartitionType.Sequential;
            c.Configuration.Sequential.LoadAhead = loadPagesAhead;
            if (conf != null)
            {
                ServerPartitionConfigurationWrapper w = new ServerPartitionConfigurationWrapper(c.Configuration.Sequential);
                conf(w);
            }
            return c;
        }
    }
}
