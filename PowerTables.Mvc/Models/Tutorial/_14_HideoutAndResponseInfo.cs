using System.Linq;
using PowerTables.Configuration;
using PowerTables.Plugins;
using PowerTables.Plugins.Hideout;
using PowerTables.Plugins.ResponseInfo;
using PowerTables.Plugins.Total;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> HideoutAndResponseInfo(this Configurator<Toy, Row> conf)
        {
            conf.RedirectingFilters();
            conf.Column(c => c.DeliveryDelay).DataOnly();
            conf.Column(c => c.Id).DataOnly();
            conf.Column(c => c.ResponsibleUserName).DataOnly(false);
            conf.Column(c => c.ItemsWasInitially).DataOnly();

            conf.HideoutMenu(c => c.IncludeAll()
                .Except(a => a.Id)
                .Except(a => a.ResponsibleUserId)
                .Except(a => a.ItemsLeft)
                .Except(a => a.DeliveryDelay)
                .Except(a => a.ItemsWasInitially)

                , ui => ui.PlaceAt("lt"));

            conf.Column(c => c.TypeOfToy).Hide(false, true);
            conf.Column(c => c.Preorders).Hide();

            conf.ResponseInfo(ui => ui.PlaceAt("lb"), "lb");
            conf.ResponseInfo(
                ui => ui.PlaceAt("rb").Configuration
                .ClientTemplate(tpl =>
                    tpl.Returns(v => v.Tag("span")
                        .Content("Filtered out:")
                        .After(t => t.Tag("strong").Content("{FilteredOut}")))),
            rdi => new TutorialResponseInfo() { FilteredOut = rdi.Source.Count() - rdi.Filtered.Count() },
              "rb"
            );

            conf.Totals(totals =>
            {
                totals.AddTotalFormat(c => c.ItemsLeft, c => c.Source.Select(v => v.ItemsLeft).DefaultIfEmpty(0).Sum(), "{v} pcs.");
                totals.AddTotalTemplate(c => c.Id, c => c.Source.Select(v => v.Id).DefaultIfEmpty(0).Max(),
                    c => c.EmptyIfNotPresentSelf().Returns(v => v.Tag("strong").Attr("class", "text-center").Content("Max ID: {@}")));
                totals.AddTotal(c => c.Price, c => c.Source.Select(v => v.Price).DefaultIfEmpty(0).Average(), "function(v) { return 'Avg. Price: $' + parseFloat(v).toFixed(2); }");
            });
            return conf;
        }
    }

    public class TutorialResponseInfo
    {
        public int FilteredOut { get; set; }
    }
}