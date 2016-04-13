using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Value;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> TableAdvancedTemplating(this Configurator<Toy, Row> conf)
        {
            conf.ButtonsAndCheckboxify();
            return conf;
        }
    }
}