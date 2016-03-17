using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

using PowerTables.Filters.Select;

namespace PowerTables.Filters.Range
{
    public class RangeFilterClientConfig
    {
        public string FromPlaceholder { get; set; }
        public string ToPlaceholder { get; set; }
        public int InputDelay { get; set; }
        public string FromValue { get; set; }
        public string ToValue { get; set; }
    }
}
