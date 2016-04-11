using System.Linq;
using System.Web.Mvc.Html;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Multi;
using PowerTables.Filters.Range;
using PowerTables.Filters.Select;
using PowerTables.Filters.Value;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins.Hideout;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> HideoutAndResponseInfo(this Configurator<SourceData, TargetData> conf)
        {
            conf.Filtering();
            conf.HideoutMenu(c => c.IncludeAll().Except(a => a.Id)
                .Except(a=>a.BehindProperty)
                .Except(a=>a.SomethingDataOnly), ui => ui.PlaceAt("lt"));
            conf.Column(c => c.NullableDate).Hide(false, true);
            conf.Column(c => c.SomeCustomTemplate).Hide();
            return conf;
        }
    }
}