namespace Reinforced.Lattice.Filters
{
    /// <summary>
    /// Filter that is attached to specified column
    /// </summary>
    public interface IColumnFilter : IFilter
    {
        /// <summary>
        /// Column name which this filter belongs to
        /// </summary>
        string ColumnName { get; set; }
    }
}
