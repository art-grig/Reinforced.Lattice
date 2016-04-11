using PowerTables.Configuration;
using PowerTables.Plugins;
using PowerTables.Plugins.Loading;
using PowerTables.Plugins.Ordering;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> OrderingAndLoadingInidicator(this Configurator<SourceData, TargetData> conf)
        {
            conf.ProjectionTitlesAndDataOnly();

            conf.LoadingIndicator(where: "rt");
            conf.Column(c => c.Cost).Orderable(c => c.Cost, ui => ui.DefaultOrdering(Ordering.Descending));
            conf.Column(c => c.GroupName).Orderable(c => c.VeryName);
            conf.Column(c => c.ItemsCount).Title("Items count (client ordering)").Orderable(c => c.ItemsCount, ui => ui.UseClientOrdering());

            return conf;
        }
    }
}