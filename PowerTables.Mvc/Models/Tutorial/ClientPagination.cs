﻿using PowerTables.Configuration;
using PowerTables.Plugins;
using PowerTables.Plugins.Limit;
using PowerTables.Plugins.MouseSelect;
using PowerTables.Plugins.Paging;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> ClientPagination(this Configurator<Toy, Row> conf)
        {
            conf.OrderingAndLoadingInidicator();
            conf.LoadImmediately(false);
            conf.Limit(ui => ui.PlaceAt("lt")
                .EnableClientLimiting() // lets enable client limiting
                .Values(new[]
            {
                "Everything",           // any text will be interpreted as "all records"
                "-",                    // dash will be interpreted as separator
                "5", "10", "-", "50", "100","250","1000","2000"
            }, "10"));


            conf.Paging(
                ui =>
                    ui.PlaceAt("rb")
                    .EnableClientPaging()                       // Client limiting cannot work without client paging
                    .PagingWithPeriods(useFirstLasPage: true)   // lets pick most complex paging
                    .UseGotoPage()                              // and also enable "Go to page" functionality
                );
            conf.MouseSelect(ui => { });
            return conf;
        }
    }
}