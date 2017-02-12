using System.Collections.Generic;
using System.Web.Mvc;
using Reinforced.Lattice.DebugSink.Models.Tutorial;

namespace Reinforced.Lattice.DebugSink.Models
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