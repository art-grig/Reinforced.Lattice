using PowerTables.Configuration;
using PowerTables.Plugins;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.Paging;
using PowerTables.Plugins.Scrollbar;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> ClientPagination(this Configurator<Toy, Row> conf)
        {
            conf.OrderingAndLoadingInidicator();
            conf.LoadImmediately(false);

            conf.Limit(ui => ui.PlaceAt("lt")
                .Values(new[]
            {
                "Everything",           // any text will be interpreted as "all records"
                "-",                    // dash will be interpreted as separator
                "5", "10", "-", "50", "100","250","1000","2000"
            }));


            conf.Paging(
                ui =>
                    ui.PlaceAt("rb")
                    .PagingWithPeriods(useFirstLasPage: true)   // lets pick most complex paging
                    .UseGotoPage()                              // and also enable "Go to page" functionality
                );
            conf.Partition(x => x.InitialSkipTake(take: 10));
            conf.Scrollbar(x => x.Vertical().KeyboardScrollFocusMode(KeyboardScrollFocusMode.MouseClick));
            return conf;
        }
    }
}