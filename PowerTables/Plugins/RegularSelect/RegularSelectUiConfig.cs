namespace PowerTables.Plugins.RegularSelect
{
    public class RegularSelectUiConfig
    {
        public RegularSelectMode Mode { get; set; }
    }

    public enum RegularSelectMode
    {
        Rows,
        Cells
    }
}
