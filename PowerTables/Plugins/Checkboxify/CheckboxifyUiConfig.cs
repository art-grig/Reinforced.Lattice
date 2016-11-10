using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.Checkboxify
{
    public class CheckboxifyUiConfig
    {
        public string SelectAllTemplateId { get; set; }

        public CheckboxifyUiConfig()
        {
            SelectAllTemplateId = "checkboxifySelectAll";
        }
    }
}
