using System.Collections.Generic;
using PowerTables.ResponseProcessing;

namespace PowerTables
{
    /// <summary>
    /// Additional data provider interface    
    /// </summary>
    public interface IAdditionalDataProvider
    {
        /// <summary>
        /// Additional data being serialized for client. 
        /// This field could contain anything that will be parsed on client side and corresponding actions will be performed. 
        /// See <see cref="IResponseModifier"/> 
        /// </summary>
        Dictionary<string, object> AdditionalData { get; }
    }
}
