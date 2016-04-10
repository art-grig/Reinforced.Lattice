using PowerTables.Configuration;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> Messages(this Configurator<SourceData, TargetData> conf)
        {
            conf.OrderingAndLoadingInidicator();
            conf.LoadImmediately(false);

            // here we intentionally create query error
            conf.ProjectDataWith(c => null);
            // no special settings required
            // activate server ordering to see an error
            return conf;
        }
    }
}