using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Plugins.Total;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> ClientTotals(this Configurator<Toy, Row> conf)
        {
            conf.Filtering();
            conf.Column(c => c.ItemsLeft).DataOnly(false);
            conf.Column(c => c.Preorders).DataOnly(false);
            conf.Column(c => c.Id).DataOnly(false);
            conf.Column(c => c.CreatedDate).DataOnly(false);
            conf.Column(c => c.LastSoldDate).DataOnly(false);

            conf.Totals(a =>
            {
                a.AddClientAverage(c => c.ItemsLeft, "{ItemsLeft}", ClientDataSet.Filtered, tpl => tpl.Returns("Average: `{@}.toFixed(2)`"));
                a.AddClientSum(c => c.Preorders, "{Preorders}", ClientDataSet.Displaying, tpl => tpl.Returns("Sum (displaying only): {@}"));
                a.AddClientSumPredicate(c => c.Price, "{Price}","{Preorders}>2", ClientDataSet.Displaying, tpl => tpl.Returns("Sum where preorders > 2: {@}"));
                a.AddClientSumPredicate(c => c.TypeOfToy, "{Price}", "{Preorders}<2", ClientDataSet.Displaying,
                    tpl =>
                    {
                        tpl.ReturnsIf("{@}<2000", "<span style='color:red'>Need more gold: {@}</span>");
                        tpl.Returns("Sum where preorders < 2: {@}");
                    });
                a.AddClientCount(c => c.Id, ClientDataSet.Filtered, tpl => tpl.Returns("Total count: {@}"));
                a.AddClientMax(c => c.CreatedDate,"{Price}", ClientDataSet.Filtered, tpl => tpl.Returns("Max price: `{@}.toFixed(2)` $"));
                a.AddClientMin(c => c.LastSoldDate, "{Price}", ClientDataSet.Filtered, tpl => tpl.Returns("Min price: `{@}.toFixed(2)` $"));
                a.AddClientWeightedAverage(c => c.ItemsSold, "{Price}*{ItemsSold}","{State}", ClientDataSet.Displaying, tpl => tpl.Returns("W/A price*sold|state: `{@}.toFixed(2)` $"));

            });
            return conf;
        }
    }
}