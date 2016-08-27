using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using PowerTables.CellTemplating;
using PowerTables.Configuration;
using PowerTables.Editing;
using PowerTables.Editing.Editors.Memo;
using PowerTables.Editing.Editors.SelectList;
using PowerTables.Editors;
using PowerTables.Editors.Check;
using PowerTables.Editors.PlainText;
using PowerTables.Filters;
using PowerTables.Filters.Range;
using PowerTables.Filters.Value;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins.Formwatch;
using PowerTables.Plugins.LoadingOverlap;
using PowerTables.Plugins.Ordering;

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
                    "getDateFromDatepicker",
                    "destroyDatepicker"
            ));

            conf.LoadingOverlap(ui => ui.Overlap());
            conf.LoadImmediately(true);
            conf.Column(c => c.SupplierAddress).DataOnly(false);
            conf.Column(c => c.ItemsSold).DataOnly();
            conf.Column(c => c.DeliveryDelay).DataOnly();
            conf.Column(c => c.ItemsWasInitially).DataOnly();
            conf.Column(c => c.Preorders).DataOnly();
            conf.Column(c => c.LastSoldDate).DataOnly();
            conf.Column(c => c.ResponsibleUserName).DataOnly();
            conf.Column(c => c.Price).OrderableUi(ui => ui.DefaultOrdering(Ordering.Neutral));
            conf.Column(c => c.Id).Orderable(c => c.Id, ui => ui.DefaultOrdering(Ordering.Descending));
            conf.Column(c => c.Edit).DataOnly(false);

            conf.AdjustmentTemplates("updatedRow", "updatedCell", "addedRow");

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
                            .EditPlainText(t => t.TemplateId("plainTextEditorAlternate"))
                            ;
            conf.Column(c => c.IsPaid)
                .Template(t =>
                {
                    t.Returns(v => v.Tag("div").Content(c => c.Tag("span").Content("`{IsPaid}.toString() + ({^IsUpdated}?'edited':'')`").EditPencil()));
                })
                            .EditCheck()
                            ;
            conf.Column(c => c.SupplierAddress)
                .Template(t => t.Returns(
                    v => v.Tag("div").Content(
                        c => c.Tag("span").Content("{SupplierAddress}").EditPencil())))
                            .EditMemo(c => c.Size(3, 10))
                            ;

            conf.Column(c => c.TypeOfToy)
                .FormatEnumWithDisplayAttribute((tpl, v) => tpl.Content(v.Text).EditPencil())
                .EditSelectList(c => c.Items(EnumHelper.GetSelectList(typeof(ToyType))).WithEmptyElement("---Select---", false))
                ;

            conf.Column(c => c.Edit).Template(c =>
            {
                c.ReturnsIf("{^IsEditing}", v =>
                {
                    v.Tag("button").Class("btn btn-default btn-sm").Content("Save").RowCommitTrigger()
                        .After(x => x.Tag("button").Class("btn btn-default btn-sm").Content("Cancel").RowRejectTrigger());
                });
                c.Returns(v =>
                {
                    v.Tag("button").Class("btn btn-default btn-sm").Content("Edit").RowEditTrigger();
                });
            });
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