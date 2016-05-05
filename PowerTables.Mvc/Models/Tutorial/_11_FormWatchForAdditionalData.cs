using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
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
            conf.ReloadButton(ui => ui.ForceReload().Order(3),"lt");
            conf.LoadingOverlap(ui => ui.Overlap("#searchForm"));
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