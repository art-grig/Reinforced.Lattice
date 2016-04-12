using PowerTables.Configuration;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> ButtonsAndCheckboxify(this Configurator<SourceData, TargetData> conf)
        {
            conf
                .DatePicker("createDatePicker", "mm/dd/yyyy", "MM/dd/yyyy")
                .AppendEmptyFilters();
            return conf;
        }
    }
}