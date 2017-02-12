using System.Collections.Generic;

using Newtonsoft.Json;
using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice
{
    /// <summary>
    /// Data request constructed in Javascript, passed to server and extracted from ControllerContext
    /// </summary>
    public class LatticeRequest
    {
        /// <summary>
        /// Reference to table configurator
        /// </summary>
        [JsonIgnore]
        public IConfigurator Configurator { get; set; }
        /// <summary>
        /// Command (default is "query")
        /// </summary>
        public string Command { get; set; }

        /// <summary>
        /// Data query itself
        /// </summary>
        public Query Query { get; set; }

        /// <summary>
        /// Denotes that this request is "deferred". 
        /// So the request itself will be stored and token will be returned to client. 
        /// So the result of this request could be gathered later by corresponding GET request providing token.
        /// </summary>
        public bool IsDeferred { get; set; }
    }

    /// <summary>
    /// Data query (part of request)
    /// </summary>
    public class Query
    {
        /// <summary>
        /// Partition information
        /// </summary>
        public Partition Partition { get; set; }
        
        /// <summary>
        /// Ordering information. Key = column name, Ordering = ordering
        /// </summary>
        public Dictionary<string, Ordering> Orderings { get; set; }
        
        /// <summary>
        /// Filtering arguments. Key = column name, Value = filter argument
        /// </summary>
        public Dictionary<string, string> Filterings { get; set; }
        
        /// <summary>
        /// Additional data. Random KV object
        /// </summary>
        public Dictionary<string, string> AdditionalData { get; set; }

        /// <summary>
        /// Static data extractable via Reinforced.LatticeHandler
        /// </summary>
        public string StaticDataJson { get; set; }

        /// <summary>
        /// Raw selection data (primary key to selected columns array)
        /// </summary>
        public Dictionary<string,int[]> Selection { get; set; }

        /// <summary>
        /// Will result of this query be appended to existing local data
        /// </summary>
        public bool IsBackgroundDataFetch { get; set; }
    }

    

    /// <summary>
    /// Paging information
    /// </summary>
    public class Partition
    {
        public int Skip { get; set; }

        public int Take { get; set; }

        public bool NoCount { get; set; }
    }

    /// <summary>
    /// Ordering
    /// </summary>
    public enum Ordering
    {
        /// <summary>
        /// Ascending
        /// </summary>
        Ascending,
        /// <summary>
        /// Descending
        /// </summary>
        Descending,
        /// <summary>
        /// Ordering is not applied
        /// </summary>
        Neutral
    }
}
