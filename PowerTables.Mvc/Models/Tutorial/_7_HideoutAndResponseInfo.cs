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
using PowerTables.Plugins.ResponseInfo;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> HideoutAndResponseInfo(this Configurator<SourceData, TargetData> conf)
        {
            conf.Filtering();
            conf.HideoutMenu(c => c.IncludeAll().Except(a => a.Id)
                .Except(a => a.BehindProperty)
                .Except(a => a.SomethingDataOnly), ui => ui.PlaceAt("lt"));
            conf.Column(c => c.NullableDate).Hide(false, true);
            conf.Column(c => c.SomeCustomTemplate).Hide();
            conf.ResponseInfo(ui => ui.PlaceAt("lb"), "lb");
            conf.ResponseInfo(
                ui => ui.PlaceAt("rb").Configuration
                .ClientTemplate(tpl =>
                    tpl.Returns(v => v.Tag("span")
                        .Inside("Filtered out:")
                        .After(t => t.Tag("strong").Inside("{FilteredOut}")))),
            rdi => new TutorialResponseInfo() { FilteredOut = rdi.Source.Count() - rdi.Filtered.Count() },
              "rb"
            );


            return conf;
        }
    }

    public class TutorialResponseInfo
    {
        public int FilteredOut { get; set; }
    }
}