using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Value;
using PowerTables.Plugins;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.LoadingOverlap;
using PowerTables.Plugins.Reload;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> FormWatchForAdditionalData(this Configurator<Toy, Row> conf)
        {
            conf.ButtonsAndCheckboxify();
            conf.ReloadButton(ui => ui.ForceReload().RenderTo("#reloadPlaceholder"));
            conf.ReloadButton(ui => ui.ForceReload().Order(3), "lt");
            conf.LoadingOverlap(ui => ui.Overlap("#searchForm"));
            conf.Column(c => c.Name)
                .Template(tpl => tpl.Returns(a => a.Tag("span").Css("color", "blue").Css("cursor", "pointer").Content("{Name}")))
                .SubscribeCellEvent(c => c.Handle("click", "objectEventHandler"));

            conf.Column(c => c.Preorders)
                .Template(tpl => tpl.Returns(a => a.Tag("span").Css("background-color", "aliceblue").Css("cursor", "pointer").Content("{Preorders}").Class("moveme")));

            conf.Column(c => c.Price)
                .Template(
                    tpl =>
                        tpl.Returns(
                            a =>
                                a.Tag("span").Content("`{Price}.toFixed(2)` ")
                                .After(b => b.Tag("button").Class("btn btn-xs btn-info").Data("clickme", "true").Content("Click me"))))
                                .SubscribeCellEvent(c => c.Handle("mousemove", "selectorEventHandler").Selector("[data-clickme]"));

            conf.SubscribeRowEvent(c => c.Handle("click", "rowEventHandler"));
            conf.SubscribeRowEvent(c => c.Handle("click", "rowSelectorEventHandler").Selector(".moveme"));

            return conf;
        }
    }

    public class FormWatchTutorialModel
    {
        public Configurator<Toy, Row> Table { get; set; }
        [Display(Name = "Change this and reload")]
        public int MinimumCost { get; set; }
        [Display(Name = "This too")]
        public string GroupNamePart { get; set; }
        public string ICloudLock { get; set; }
        public int? IdFrom { get; set; }
        public int? IdTo { get; set; }

        public SelectListItem[] ValuesForIcloudlock { get; set; }
        public SomeType[] TypesList { get; set; }
        public IList<SelectListItem> Types { get; set; }
    }

    public enum SomeType
    {
        [Display(Name = "Type one")]
        One,
        [Display(Name = "Type two")]
        Two,
        [Display(Name = "Type three")]
        Three
    }
}