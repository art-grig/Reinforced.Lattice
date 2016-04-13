using PowerTables.Configuration;
using PowerTables.Plugins;
using PowerTables.Plugins.Loading;
using PowerTables.Plugins.Ordering;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> OrderingAndLoadingInidicator(this Configurator<Toy, Row> conf)
        {
            conf.ProjectionTitlesAndDataOnly();

            conf.LoadingIndicator(where: "rt");
            conf.Column(c => c.Price).Orderable(c => c.Price, ui => ui.DefaultOrdering(Ordering.Descending));
            conf.Column(c => c.Name).Orderable(c => c.ToyName);
            conf.Column(c => c.ItemsSold).Title("Sold (client ordering)").Orderable(c => c.ItemsLeft, ui => ui.UseClientOrdering());

            return conf;
        }
    }
}