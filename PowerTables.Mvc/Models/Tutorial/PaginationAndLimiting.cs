using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Value;
using PowerTables.Plugins;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.Paging;
using PowerTables.Plugins.Scrollbar;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> Pagination(this Configurator<Toy, Row> conf)
        {
            conf.OrderingAndLoadingInidicator();
            conf.LoadImmediately(false);
            conf.AppendEmptyFilters();
            conf.Limit(ui => ui.PlaceAt("lt")
                .Values(new[]
                {
                    "Everything",           // any text will be interpreted as "all records"
                    "-",                    // dash will be interpreted as separator
                    "5", "10", "14", "-", "50", "100","250","1000","2000"
                }));


            conf.Paging(
                ui =>
                    ui.PlaceAt("rb")
                    .PagingSimple(true)); // lets pick simple arrows left/right paging
            conf.Scrollbar(x => x.Horizontal(HorizontalStick.Top));
            conf.Column(c => c.Name).FilterValueUi(x => x.ClientFiltering());
            conf.Partition(x => x.Server(conf: d => d.Indication(false, false), ifClientSearch: d => d.Indication()).InitialSkipTake(take: 14));
            return conf;
        }
    }
}