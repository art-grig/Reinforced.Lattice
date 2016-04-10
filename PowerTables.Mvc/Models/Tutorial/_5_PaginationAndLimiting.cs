using PowerTables.Configuration;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.Paging;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> Pagination(this Configurator<SourceData, TargetData> conf)
        {
            conf.OrderingAndLoadingInidicator();
            conf.LoadImmediately(false);
            conf.Limit(new[]
            {
                "Everything",  // any text will be interpreted as "all records"
                "-",              // dash will be interpreted as separator
                "5", "10", "-", "50", "100"
            }, "10", position: "lt", enableCientLimiting: true);
            conf.PagingWithPeriods(position: "lb", useGotoPage: true, useFirstLasPage: true);
            return conf;
        }
    }
}