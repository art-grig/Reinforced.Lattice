using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.Loading
{
    public class LoadingUiConfig : IProvidesTemplate
    {
        public string DefaultTemplateId { get { return "loading"; } }
    }
}
