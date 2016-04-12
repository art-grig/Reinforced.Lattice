using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using PowerTables.Configuration;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> FormWatchForm(this Configurator<SourceData, TargetData> conf)
        {
            conf.ButtonsAndCheckboxify();
            return conf;
        }
    }

    public class FormWatchTutorialModel
    {
        public Configurator<SourceData, TargetData> Table { get; set; }

        public int MinimumCost { get; set; }

        public string GroupNamePart { get; set; }

        public string ICloudLock { get; set; }

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