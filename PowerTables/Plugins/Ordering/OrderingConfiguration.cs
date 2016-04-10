using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Ordering
{
    /// <summary>
    /// Client per-column configuration for ordering. 
    /// See <see cref="OrderingExtensions"/>
    /// </summary>
    public class OrderingConfiguration
    {
        /// <summary>
        /// Default orderings for columns. Key - column RawName, Value - ordering direction
        /// </summary>
        public Dictionary<string, PowerTables.Ordering> DefaultOrderingsForColumns { get; private set; }

        /// <summary>
        /// Columns that are sortable on client-side with corresponding comparer functions
        /// </summary>
        public Dictionary<string, JRaw> ClientSortableColumns { get; private set; }

        public OrderingConfiguration()
        {
            DefaultOrderingsForColumns = new Dictionary<string, PowerTables.Ordering>();
            ClientSortableColumns = new Dictionary<string, JRaw>();
        }
    }
}