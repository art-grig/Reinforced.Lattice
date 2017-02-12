using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Plugins.Scrollbar;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> ScrollbarTest(this Configurator<Toy, Row> conf)
        {
            conf.ProjectionTitlesAndDataOnly();

            conf.Partition(c => c.Client().InitialSkipTake(take:19));
            conf.Scrollbar(x => x.AppendTo(TableElement.All).Vertical().KeyboardScrollFocusMode(KeyboardScrollFocusMode.MouseClick));
            return conf;
        }
    }
}