using PowerTables.Configuration;
using PowerTables.Processing;

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
        LatticeMessage Message { get; set; }
    }

    public interface IGenericAdditionalDataProvider<TSource, TData> : IAdditionalDataProvider where TData : new()
    {
        Configurator<TSource, TData> Configurator { get; }
    }

    public class ReloadAdditionalData
    {
        public bool ForceServer { get; set; }

        public string[] ReloadTableIds { get; set; }
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

        private const string ReloadKey = "Reload";
        
        public static T Reload<T>(this T c, bool forceServer, params string[] additionalTablesToReload) where T : IAdditionalDataProvider
        {
            var ad = c.GetOrCreateAdditionalData<ReloadAdditionalData>(ReloadKey);
            ad.ForceServer = forceServer;
            ad.ReloadTableIds = additionalTablesToReload;
            return c;
        }
    }
}
