namespace PowerTables.Filters.Range
{
    /// <summary>
    /// Describes values range for range column filter
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class RangeTuple<T>
    {
        /// <summary>
        /// Minimum value
        /// </summary>
        public T From { get; set; }

        /// <summary>
        /// Is minimum value specified (in case if T is value type)
        /// </summary>
        public bool HasFrom { get; set; }

        /// <summary>
        /// Maximum value
        /// </summary>
        public T To { get; set; }

        /// <summary>
        /// Is maximum value specified (in case if T is value type)
        /// </summary>
        public bool HasTo { get; set; }

        public RangeTuple()
        {
            HasFrom = false;
            HasTo = false;
        }
    }
}