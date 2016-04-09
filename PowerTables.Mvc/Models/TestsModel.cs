using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PowerTables.Configuration;

namespace PowerTables.Mvc.Models
{
    public static class TestTables
    {
        public static Configurator<SourceData, TargetData> Test1(this Configurator<SourceData, TargetData> conf)
        {
            conf
                .DatePicker("function(v,f){ v.datepicker({ format: f, weekStart: 1 }); }", "mm/dd/yyyy", "MM/dd/yyyy");


            return conf;
        }
    }
}