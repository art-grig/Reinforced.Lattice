namespace PowerTables.Templating.Handlebars
{
    /// <summary>
    /// Javascript objects dictionary
    /// </summary>
    /// <typeparam name="TKey"></typeparam>
    /// <typeparam name="T"></typeparam>
    public interface IHbDictionary<TKey,T>
    {
        /// <summary>
        /// Length
        /// </summary>
        int Length { get;}

        /// <summary>
        /// Object at specified key
        /// </summary>
        /// <param name="key">Key</param>
        /// <returns>Dictionary entry</returns>
        T this[TKey key] { get; }
    }

    public interface IJsObject
    {
        object this[string key] { get; }
    }
}
