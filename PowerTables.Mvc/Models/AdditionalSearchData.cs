using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PowerTables.Mvc.Models
{
    public class AdditionalSearchData
    {
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