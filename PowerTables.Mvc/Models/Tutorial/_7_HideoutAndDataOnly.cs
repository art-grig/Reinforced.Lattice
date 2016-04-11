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
        public static Configurator<SourceData, TargetData> HideoutAndDataOnly(this Configurator<SourceData, TargetData> conf)
        {
            conf.Filtering();

            return conf;
        }
    }
}