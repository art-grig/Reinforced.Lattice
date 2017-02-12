using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace Reinforced.Lattice.Plugins.Formwatch
{
    public class FormwatchClientConfiguration
    {
        public bool DoNotEmbed { get; set; }

        public List<FormwatchFieldData> FieldsConfiguration { get; set; }

        public Dictionary<string,FormWatchFilteringsMappings> FiltersMappings { get; set; }

        public FormwatchClientConfiguration()
        {
            FieldsConfiguration = new List<FormwatchFieldData>();
            FiltersMappings = new Dictionary<string, FormWatchFilteringsMappings>();
        }
    }

    public class FormWatchFilteringsMappings
    {
        /// <summary>
        /// 0 = value filter, 1 = range filter, 2 = multiple filter
        /// </summary>
        public int FilterType { get; set; }

        public string[] FieldKeys { get; set; }

        public bool ForServer { get; set; }

        public bool ForClient { get; set; }

        public FormWatchFilteringsMappings()
        {
            ForClient = true;
            ForServer = true;
        }
    }

    public class FormwatchFieldData
    {
        public string FieldJsonName { get; set; }

        public string FieldSelector { get; set; }

        public JRaw FieldValueFunction { get; set; }

        public string[] TriggerSearchOnEvents { get; set; }

        public string ConstantValue { get; set; }

        public int SearchTriggerDelay { get; set; }

        public bool SetConstantIfNotSupplied { get; set; }

        public string Key { get; set; }
        public bool AutomaticallyAttachDatepicker { get; set; }
        public bool IsDateTime { get; set; }
        public bool IsArray { get; set; }
        public bool IsBoolean { get; set; }
        public bool IsString { get; set; }
        public bool IsInteger { get; set; }
        public bool IsFloating { get; set; }
        public string ArrayDelimiter { get; set; }
        
    }
}
