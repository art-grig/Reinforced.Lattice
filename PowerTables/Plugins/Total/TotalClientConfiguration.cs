using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI;

using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Total
{
    public class TotalClientConfiguration
    {
        public bool ShowOnTop { get; set; }

        public Dictionary<string, JRaw> ColumnsValueFunctions { get; set; }
    }
}
