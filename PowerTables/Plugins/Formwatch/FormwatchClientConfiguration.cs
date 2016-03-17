using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Formwatch
{
    public class FormwatchClientConfiguration
    {
        public List<FormwatchFieldData> FieldsConfiguration { get; set; }

        public FormwatchClientConfiguration()
        {
            FieldsConfiguration = new List<FormwatchFieldData>();
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
    }
}
