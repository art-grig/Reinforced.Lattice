using Newtonsoft.Json;

namespace Reinforced.Lattice
{
    /// <summary>
    /// Provides handy extensions for request and Query object
    /// </summary>
    public static class RequestExtensions
    {
        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        ///  <param name="key">Key in additional data</param>
        /// <param name="clientQuery">Query</param>
        /// <returns>ViewModel</returns>
        public static T RetrieveAdditionalObject<T>(this Query clientQuery, string key)
        {
            if (!clientQuery.AdditionalData.ContainsKey(key)) return default(T);
            return JsonConvert.DeserializeObject<T>(clientQuery.AdditionalData[key]);
        }

        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        ///  <param name="key">Key in additional data</param>
        /// <param name="clientQuery">Query</param>
        /// <param name="converters">Converters to be supplied to Json.Net</param>
        /// <returns>RetrieveAdditionalObject ViewModel</returns>
        public static T RetrieveAdditionalObject<T>(this Query clientQuery, string key, params JsonConverter[] converters)
        {
            if (!clientQuery.AdditionalData.ContainsKey(key)) return default(T);
            return JsonConvert.DeserializeObject<T>(clientQuery.AdditionalData[key], converters);
        }

        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        ///  <param name="key">Key in additional data</param>
        /// <param name="clientQuery">Query</param>
        /// <param name="serializerSettings">Serializer settings to be supplied to Json.Net</param>
        /// <returns>RetrieveAdditionalObject ViewModel</returns>
        public static T RetrieveAdditionalObject<T>(this Query clientQuery, string key, JsonSerializerSettings serializerSettings)
        {
            if (!clientQuery.AdditionalData.ContainsKey(key)) return default(T);
            return JsonConvert.DeserializeObject<T>(clientQuery.AdditionalData[key], serializerSettings);
        }

        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="key">Key in additional data</param>
        /// <param name="request">Reinforced.Lattice request</param>
        /// <returns>Additional data object</returns>
        public static T RetrieveAdditionalObject<T>(this LatticeRequest request, string key)
        {
            return RetrieveAdditionalObject<T>(request.Query, key);
        }

        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="request">Reinforced.Lattice request</param>
        /// <param name="key">Key in additional data</param>
        /// <param name="converters">Converters to be supplied to Json.Net</param>
        /// <returns>RetrieveAdditionalObject ViewModel</returns>
        public static T RetrieveAdditionalObject<T>(this LatticeRequest request, string key, params JsonConverter[] converters)
        {
            return RetrieveAdditionalObject<T>(request.Query, key, converters);
        }

        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="request">Reinforced.Lattice request</param>
        ///  <param name="key">Key in additional data</param>
        /// <param name="serializerSettings">Serializer settings to be supplied to Json.Net</param>
        /// <returns>RetrieveAdditionalObject ViewModel</returns>
        public static T RetrieveAdditionalObject<T>(this LatticeRequest request, string key, JsonSerializerSettings serializerSettings)
        {
            return RetrieveAdditionalObject<T>(request.Query, key, serializerSettings);
        }


        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="key">Key in additional data</param>
        /// <param name="request">Reinforced.Lattice request</param>
        /// <returns>Additional data object</returns>
        public static T RetrieveAdditionalObject<T>(this IRequestable request, string key)
        {
            return RetrieveAdditionalObject<T>(request.Request, key);
        }

        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="request">Reinforced.Lattice request</param>
        /// <param name="key">Key in additional data</param>
        /// <param name="converters">Converters to be supplied to Json.Net</param>
        /// <returns>RetrieveAdditionalObject ViewModel</returns>
        public static T RetrieveAdditionalObject<T>(this IRequestable request, string key, params JsonConverter[] converters)
        {
            return RetrieveAdditionalObject<T>(request.Request, key, converters);
        }

        /// <summary>
        /// Retrieves additional JSONed data from AdditionalData collection
        /// </summary>
        /// <typeparam name="T">Object type</typeparam>
        /// <param name="request">Reinforced.Lattice request</param>
        ///  <param name="key">Key in additional data</param>
        /// <param name="serializerSettings">Serializer settings to be supplied to Json.Net</param>
        /// <returns>RetrieveAdditionalObject ViewModel</returns>
        public static T RetrieveAdditionalObject<T>(this IRequestable request, string key, JsonSerializerSettings serializerSettings)
        {
            return RetrieveAdditionalObject<T>(request.Request, key, serializerSettings);
        }
    }
}
