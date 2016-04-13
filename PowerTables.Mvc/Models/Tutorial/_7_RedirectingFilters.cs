using System.Linq;
using System.Web.Mvc.Html;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Multi;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.FrequentlyUsed;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> RedirectingFilters(this Configurator<Toy, Row> conf)
        {
            conf.Filtering();
            conf.Column(c => c.ItemsLeft).Title("Shows 'Left', Filters min.price")
                .FilterValue(c => c.ItemsLeft, ui =>
                {
                    ui.Configuration.Placeholder = "Minimum cost";
                    ui.Configuration.DefaultValue = conf.ToFilterDefaultString(50);
                    ui.Configuration.InputDelay = 50;
                    ui.Configuration.ClientFiltering("function(obj,value) { return obj.Cost > parseFloat(value); }");
                })
                .By((q, v) => q.Where(c => c.Price > v));

           
            return conf;
        }
    }
}