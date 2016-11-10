using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.RegularSelect
{
    public class RegularSelectUiConfig
    {
        public RegularSelectMode Mode { get; set; }
    }

    public enum RegularSelectMode
    {
        Rows,
        Cells
    }
}
