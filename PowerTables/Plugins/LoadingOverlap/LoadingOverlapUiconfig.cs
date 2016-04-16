using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.LoadingOverlap
{
    public class LoadingOverlapUiConfig : IProvidesTemplate
    {
        public OverlapMode OverlapMode { get; set; }

        

        public string DefaultTemplateId { get { return "loadingOverlap"; } }
    }

    public enum OverlapMode
    {
        All,
        BodyOnly
    }
}
