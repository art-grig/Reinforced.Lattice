﻿using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Configuration
{
    public class ServerPartitionConfigurationWrapper
    {
        public ServerPartitionConfigurationWrapper(ServerPartitionConfiguration configuration)
        {
            Configuration = configuration;
        }

        internal ServerPartitionConfiguration Configuration { get; private set; }
    }

    public static class ServerPartitionConfigurationExtensions
    {
        public static ServerPartitionConfigurationWrapper LoadAhead(this ServerPartitionConfigurationWrapper c
            , int loadPagesAhead = 2)
        {
            c.Configuration.LoadAhead = loadPagesAhead;
            return c;
        }

        public static ServerPartitionConfigurationWrapper Indication(this ServerPartitionConfigurationWrapper c
            , bool appendLoadingRow = true,bool useLoadMore = true,string template = "partitionIndication")
        {
            c.Configuration.AppendLoadingRow = appendLoadingRow;
            c.Configuration.UseLoadMore = useLoadMore;
            c.Configuration.LoadingRowTemplateId = template;
            return c;
        }
    }

}
