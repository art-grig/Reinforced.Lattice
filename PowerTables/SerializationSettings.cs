using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace PowerTables
{
    public static class SerializationSettings
    {
        public static JsonSerializerSettings ResponseSerializationSettings = new JsonSerializerSettings()
        {
            Formatting = Formatting.None,
            NullValueHandling = NullValueHandling.Ignore,
            Converters = new List<JsonConverter>() { new IsoDateTimeConverter() }
        };

        public static JsonSerializerSettings ConfigSerializationSettings = new JsonSerializerSettings()
        {
            Formatting = Formatting.Indented,
            NullValueHandling = NullValueHandling.Ignore,
            Converters = new List<JsonConverter>() { new JavaScriptDateTimeConverter() }
        };
    }
}
