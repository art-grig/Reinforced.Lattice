using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using PowerTables.Configuration;
using PowerTables.Editors;
using PowerTables.Editors.PlainText;
using PowerTables.Editors.SelectList;
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
                        c => c.Tag("span").Content("`dateFormat({CreatedDate},'dd mmm yyyy',false)`").EditPencil())))
                            .EditPlainText()
                            ;
            conf.Column(c => c.Price)
                .Template(t => t.Returns(
                    v => v.Tag("div").Content(
                        c => c.Tag("span").Content("{Price}").EditPencil())))
                            .EditPlainText()
                            ;

            conf.Column(c => c.TypeOfToy)
                .FormatEnumWithDisplayAttribute((tpl, v) => tpl.Content(v.Text).EditPencil())
                .EditSelectList(c=>c.Items(EnumHelper.GetSelectList(typeof(ToyType))))
                ;
            return conf;
        }

        private static void EditPencil(this Template t)
        {
            t.After(e => e.Tag("span").Class("pull-right").CellEditTrigger().Content(c =>
                c.Tag("button").Class("btn btn-xs").Content(
                d => d.Tag("span").Class("glyphicon glyphicon-pencil")))
            );
        }
    }
}