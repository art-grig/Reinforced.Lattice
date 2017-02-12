using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> Messages(this Configurator<Toy, Row> conf)
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