using System.Collections.Generic;
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
    }
}
