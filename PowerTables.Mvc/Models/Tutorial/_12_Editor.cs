using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using PowerTables.Configuration;
using PowerTables.Editors.PlainText;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Value;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins.Formwatch;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> Editor(this Configurator<Toy, Row> conf)
        {
            conf.ClientPagination();
            conf.Column(c => c.Name)
                .Template(t => t.Returns(v => v.Tag("span")
                    .Attr("style", "background-color:aliceblue")
                    .Data("editcell", "true").Content("{Name}")
                    ))
                .EditPlainText();
            return conf;
        }
    }
}