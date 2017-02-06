using System.Linq;
using PowerTables.Configuration;
using PowerTables.Mvc.Extensions;
using PowerTables.Plugins.Scrollbar;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> ScrollbarTest(this Configurator<Toy, Row> conf)
        {
            conf.ProjectionTitlesAndDataOnly();

            conf.Partition(c => c.Client().InitialSkipTake(take:19));
            conf.Scrollbar(x => x.Vertical().KeyboardScrollFocusMode(KeyboardScrollFocusMode.MouseClick));
            return conf;
        }
    }
}