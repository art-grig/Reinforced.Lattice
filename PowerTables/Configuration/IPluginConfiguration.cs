using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Common plugin configuration
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public interface IPluginConfiguration<T>
    {
        /// <summary>
        /// Specific plugin configuration
        /// </summary>
        T Configuration { get; }

        /// <summary>
        /// Plugin order among specific placement
        /// </summary>
        int Order { get; set; }
    }
}
