using System.Collections.Generic;
using System.Web.Mvc;
using PowerTables.Mvc.Models.Tutorial;

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

    
}