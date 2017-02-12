using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Plugins.Loading;
using Reinforced.Lattice.Plugins.Ordering;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> OrderingAndLoadingInidicator(this Configurator<Toy, Row> conf)
        {
            conf.ProjectionTitlesAndDataOnly();

            conf.LoadingIndicator(where: "rt", order: 4);
            //conf.Column(c => c.Price).Orderable(c => c.Price, ui => ui.DefaultOrdering(Ordering.Descending));
            conf.Column(c => c.Name).Orderable(c => c.ToyName);
            conf.Column(c => c.ItemsSold).Title("Sold (client ordering)");

            return conf;
        }
    }
}