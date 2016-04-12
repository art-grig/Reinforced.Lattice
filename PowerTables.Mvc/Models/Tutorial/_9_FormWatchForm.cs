using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> FormWatchForm(this Configurator<SourceData, TargetData> conf)
        {
            conf.ButtonsAndCheckboxify();
            conf.Column(c => c.GroupName).FilterValueUi(c => c.Configuration.DefaultValue = "");
            conf.WatchForm<FormWatchTutorialModel>(c =>
            {
                c.WatchAllFields();
                c.DoNotEmbedAdditionalData();
                c.Field(f => f.MinimumCost).TriggerSearchOnEvents("change", "keyup");
                c.Field(f => f.GroupNamePart).Selector("._part").TriggerSearchOnEvents("change", "keyup");

                conf.Column(v => v.Id).ByForm(c).FilterRange(v => v.IdFrom, v => v.IdTo);
                c.Field(v => v.IdFrom).TriggerSearchOnEvents(10, "change", "keyup");
                c.Field(v => v.IdTo).TriggerSearchOnEvents(10, "change", "keyup");

            });

            conf.Column(c => c.Id).FilterRangeUi(ui => ui.Configuration.HideFilter());

            return conf;
        }
    }

    public class FormWatchTutorialModel
    {
        public Configurator<SourceData, TargetData> Table { get; set; }
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