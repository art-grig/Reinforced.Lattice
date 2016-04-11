using PowerTables.Configuration;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> Basic(this Configurator<SourceData, TargetData> conf)
        {
            conf
                .DatePicker("function(v,f){ v.datepicker({ format: f, weekStart: 1 }); }", "mm/dd/yyyy", "MM/dd/yyyy")
                .AppendEmptyFilters();
            return conf;
        }
    }
}