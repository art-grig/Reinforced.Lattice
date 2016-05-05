using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.LoadingOverlap
{
    public class LoadingOverlapUiConfig : IProvidesTemplate
    {
        public Dictionary<string,string> Overlaps { get; set; }

        public string DefaultTemplateId { get { return "loadingOverlap"; } }

        public LoadingOverlapUiConfig()
        {
            Overlaps = new Dictionary<string, string>();
        }
    }

    public enum OverlapMode
    {
        All,
        BodyOnly
    }
}
