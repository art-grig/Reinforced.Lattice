using PowerTables.Configuration;
using PowerTables.Plugins;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.Paging;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> Pagination(this Configurator<Toy, Row> conf)
        {
            conf.OrderingAndLoadingInidicator();
            conf.LoadImmediately(false);
            conf.Limit(ui => ui.PlaceAt("lt")
                .Values(new[]
            {
                "Everything",           // any text will be interpreted as "all records"
                "-",                    // dash will be interpreted as separator
                "5", "10", "25", "-", "50", "100","250","1000","2000"
            }, "10"));


            conf.Paging(
                ui =>
                    ui.PlaceAt("rb")
                    .PagingWithArrows()); // lets pick simple arrows left/right paging
            return conf;
        }
    }
}