using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PowerTables.Processing;

namespace PowerTables
{
    public sealed class TableAdjustment : IAdditionalDataProvider
    {
        /// <summary>
        /// Table message associated with this response
        /// </summary>
        [JsonProperty]
        public TableMessage Message { get; set; }

        /// <summary>
        /// Special mark to disctinguish Edition result from others on client side
        /// </summary>
        [JsonProperty("__XqTFFhTxSu")]
        internal bool IsUpdateResult { get { return true; } }

        [JsonProperty]
        internal object[] UpdatedData { get; set; }

        [JsonProperty]
        internal string[] RemoveKeys { get; set; }

        [JsonProperty]
        internal Dictionary<string, TableAdjustment> OtherTablesAdjustments { get; set; }

        /// <summary>
        /// Additional data being serialized for client. 
        /// This field could contain anything that will be parsed on client side and corresponding actions will be performed. 
        /// See <see cref="IResponseModifier"/> 
        /// </summary>
        public AdditionalDataContainer AdditionalData { get; set; }
    }
}
