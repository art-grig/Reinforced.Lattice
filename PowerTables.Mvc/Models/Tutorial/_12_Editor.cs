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
            conf
                .DatePicker(new DatepickerOptions( // set up functions for 3rd party datepickers
                    "createDatePicker",
                    "putDateToDatepicker",
                    "getDateFromDatepicker"));
            conf.Column(c => c.Name)
                .Template(t => t.Returns(v => v.Tag("span")
                    .Attr("style", "background-color:aliceblue")
                    .Data("editcell", "true").Content("{Name}")
                    ))
                .EditPlainText();
            conf.Column(c => c.CreatedDate)
                .Template(t => t.Returns(
                    v => v.Tag("div").Content(
                        c => c.Tag("span").Content("`dateFormat({CreatedDate},'dd mmm yyyy',false)`")
                            .After(e => e.Tag("span").Class("pull-right").Content(EditPencil)))))
                            .EditPlainText()
                            ;
            conf.Column(c => c.Price)
                .Template(t => t.Returns(
                    v => v.Tag("div").Content(
                        c => c.Tag("span").Content("{Price}")
                            .After(e => e.Tag("span").Class("pull-right").Content(EditPencil)))))
                            .EditPlainText()
                            ;
            return conf;
        }

        private static void EditPencil(Template t)
        {
            t.Tag("button");
            t.Class("btn btn-xs");
            t.Data("editcell", "true");
            t.Content(c => c.Tag("span").Class("glyphicon glyphicon-pencil"));
        }
    }
}