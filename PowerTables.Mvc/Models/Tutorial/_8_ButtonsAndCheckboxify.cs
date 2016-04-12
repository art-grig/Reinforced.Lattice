using PowerTables.Configuration;
using PowerTables.Plugins.Checkboxify;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> ButtonsAndCheckboxify(this Configurator<SourceData, TargetData> conf)
        {
            conf.HideoutAndResponseInfo();
            conf.Checkboxify(c => c.Id, SelectAllBehavior.CurrentPage);
            return conf;
        }
    }
}