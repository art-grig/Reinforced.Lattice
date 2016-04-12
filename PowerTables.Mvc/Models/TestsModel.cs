using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.Configuration;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Models
{
    public static class TestTables
    {
        public static Configurator<SourceData, TargetData> Basic(this Configurator<SourceData, TargetData> conf)
        {
            conf
                .DatePicker("function(v,f){ v.datepicker({ format: f, weekStart: 1 }); }", "mm/dd/yyyy", "MM/dd/yyyy");
            return conf;
        }

        
    }
}