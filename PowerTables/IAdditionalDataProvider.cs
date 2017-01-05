using System.Collections.Generic;
using PowerTables.Configuration;
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
        AdditionalDataContainer AdditionalData { get; }

        /// <summary>
        /// Message to show
        /// </summary>
        TableMessage Message { get; set; }
    }

    public interface IGenericAdditionalDataProvider<TSource, TData> : IAdditionalDataProvider where TData : new()
    {
        Configurator<TSource, TData> Configurator { get; }
    }

    public static class AdditionalDataExtensions
    {
        /// <summary>
        /// Method for operating additional data collection
        /// </summary>
        /// <typeparam name="T">Additional data type</typeparam>
        /// <param name="p">Fluent</param>
        /// <param name="key">Additional data key</param>
        /// <returns>Additional data object of specified type</returns>
        public static T GetOrCreateAdditionalData<T>(this IAdditionalDataProvider p, string key) where T : new()
        {
            if (p.AdditionalData.Data.ContainsKey(key))
                return (T) p.AdditionalData.Data[key];

            var t = new T();
            p.AdditionalData.Data[key] = t;
            return t;
        }
    }
}
