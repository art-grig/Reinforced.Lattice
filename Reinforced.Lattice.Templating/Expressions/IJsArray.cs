namespace Reinforced.Lattice.Templating.Expressions
{
    /// <summary>
    /// Javascript collection
    /// </summary>
    public interface IJsArray<T>
    {
        /// <summary>
        /// Array length
        /// </summary>
        [OverrideTplFieldName("length")]
        int Length { get; }

        /// <summary>
        /// Entry at the specified index
        /// </summary>
        /// <param name="idx">Index</param>
        /// <returns></returns>
        T this[int idx] { get; }
    }
}
