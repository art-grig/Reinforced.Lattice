namespace PowerTables.Templating.Handlebars
{
    /// <summary>
    /// Javascript collection
    /// </summary>
    public interface IHbArray<T>
    {
        /// <summary>
        /// Array length
        /// </summary>
        [OverrideHbFieldName("length")]
        int Length { get; }

        /// <summary>
        /// Entry at the specified index
        /// </summary>
        /// <param name="idx">Index</param>
        /// <returns></returns>
        T this[int idx] { get; }
    }
}
