namespace PowerTables.Plugins
{
    /// <summary>
    /// Column-powered UI configuration
    /// </summary>
    public interface IProvidesColumnName
    {
        /// <summary>
        /// Column name
        /// </summary>
        string ColumnName { get; set; }
    }
}
