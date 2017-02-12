using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> TableAdvancedTemplating(this Configurator<Toy, Row> conf)
        {
            conf.ButtonsAndCheckboxify();
            return conf;
        }
    }
}