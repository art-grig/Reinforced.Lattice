using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
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
        public static ServerPartitionConfigurationWrapper NoCount(this ServerPartitionConfigurationWrapper c,
            bool noCount = true)
        {
            c.Configuration.NoCount = noCount;
            return c;
        }

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
