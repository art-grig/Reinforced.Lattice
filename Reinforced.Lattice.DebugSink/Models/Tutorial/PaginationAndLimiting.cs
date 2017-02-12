using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Filters;
using Reinforced.Lattice.Filters.Value;
using Reinforced.Lattice.Plugins;
using Reinforced.Lattice.Plugins.Limit;
using Reinforced.Lattice.Plugins.Paging;
using Reinforced.Lattice.Plugins.Scrollbar;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
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
            conf.Column(c => c.Name).FilterValueUi(x => x.ClientFiltering());


            conf.Scrollbar(x => x.Vertical());
            
            conf.Partition(x => x.Sequential(conf: d => d.Indication(false, false)).InitialSkipTake(take: 14));
            return conf;
        }
    }
}