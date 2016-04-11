using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Value;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> Filtering(this Configurator<SourceData, TargetData> conf)
        {
            conf.Pagination();

            conf.Column(c => c.ItemsCount).FilterValue(c => c.ItemsCount, ui =>
            {
                ui.Configuration.Placeholder = "Minimum cost";
                ui.Configuration.DefaultValue = conf.ToFilterDefaultString(50);
                ui.Configuration.InputDelay = 50;
                ui.Configuration.ClientFiltering();
            });

            conf.Column(c => c.GroupName).FilterValue(c => c.VeryName, ui =>
            {
                ui.Configuration.DefaultValue = conf.ToFilterDefaultString("Alpha");
            });

            conf.Column(c => c.Cost).FilterRange(c => c.Cost, ui =>
            {
                ui.Configuration.FromPlaceholder = "Min. Cost";
                ui.Configuration.ToPlaceholder = "Max. Cost";
            });
            return conf;
        }
    }
}