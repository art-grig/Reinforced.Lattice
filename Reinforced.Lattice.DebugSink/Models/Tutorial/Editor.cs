﻿using System.Web.Mvc.Html;
using Reinforced.Lattice.CellTemplating;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Editing;
using Reinforced.Lattice.Editing.Cells;
using Reinforced.Lattice.Editing.Editors.Check;
using Reinforced.Lattice.Editing.Editors.Display;
using Reinforced.Lattice.Editing.Editors.Memo;
using Reinforced.Lattice.Editing.Editors.PlainText;
using Reinforced.Lattice.Editing.Editors.SelectList;
using Reinforced.Lattice.Editing.Form;
using Reinforced.Lattice.Editing.Rows;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Plugins.Checkboxify;
using Reinforced.Lattice.Plugins.LoadingOverlap;
using Reinforced.Lattice.Plugins.Ordering;
using Reinforced.Lattice.Plugins.Toolbar;

namespace Reinforced.Lattice.DebugSink.Models.Tutorial
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

            //conf.AdjustmentTemplates("updatedRow", "updatedCell", "addedRow");

            conf.Column(c => c.Name)
                .Template(t => t.Returns(v => v.Tag("span")
                        .Attr("style", "background-color:aliceblue")
                        .Data("editcell", "true").Content("{Name}")
                ));

            conf.Column(c => c.CreatedDate)
                .Template(t => t.Returns(
                    v => v.Tag("div").Content(
                        c => c.Tag("span").Content("`dateFormat({CreatedDate},'dd mmm yyyy',false)`").EditPencil())))
                            ;
            conf.Column(c => c.Price)
                .Template(t => t.Returns(
                    v => v.Tag("div").Content(
                        c => c.Tag("span").Content("{Price}").EditPencil())))
                            ;
            conf.Column(c => c.IsPaid)
                .Template(t =>
                {
                    t.Returns(v => v.Tag("div").Content(c => c.Tag("span").Content("`{IsPaid}.toString() + ({^IsUpdated}?'edited':'')`").EditPencil()));
                })
                            ;
            conf.Column(c => c.SupplierAddress)
                .Template(t => t.Returns(
                    v => v.Tag("div").Content(
                        c => c.Tag("span").Content("{SupplierAddress}").EditPencil())))
                            ;

            conf.Column(c => c.TypeOfToy)
                .TemplateEnum(content: (t, v) => t.Content(v.Text).EditPencil())
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
                    v.Tag("button").Class("btn btn-default btn-sm").Content("Edit").RowEditTrigger().After(d => d.Tag("button").Content("Edit form").FormEditTrigger());
                });
            });

            conf.EditingCells(c =>
            {
                c.EditPlainText(x => x.Name);
                c.EditPlainText(x => x.CreatedDate);
                c.EditPlainText(x => x.Price).EditorTemplateId("plainTextEditorAlternate");
                c.EditCheck(x => x.IsPaid);
                c.EditMemo(x => x.SupplierAddress).Size(3, 10);
                c.EditSelectList(x => x.TypeOfToy).Items(EnumHelper.GetSelectList(typeof(ToyType))).WithEmptyElement("---Select---", false);
            });

            conf.EditingRow(c =>
            {
                c.EditPlainText(x => x.Name);
                c.EditPlainText(x => x.CreatedDate);
                c.EditPlainText(x => x.Price);
                c.EditCheck(x => x.IsPaid);
                c.EditSelectList(x => x.TypeOfToy).Items(EnumHelper.GetSelectList(typeof(ToyType))).WithEmptyElement("---Select---", false);
            });

            conf.EditingForm(c =>
            {
                c.EditPlainText(x => x.Name);
                c.EditPlainText(x => x.CreatedDate);
                c.EditPlainText(x => x.Price);
                c.EditCheck(x => x.IsPaid);
                c.EditMemo(x => x.SupplierAddress).Size(3, 10);
                c.EditSelectList(x => x.TypeOfToy).Items(EnumHelper.GetSelectList(typeof(ToyType))).WithEmptyElement("---Select---", false);
                c.Display(x => x.Preorders).DisplayTemplate(v => v.ReturnsIf("{Price}>100", "<span style='color:red'>Price is too high</span>", "<span style='color:green'>Price is okay</span>"));
                c.RenderTo("#confirmationContent", "simpleEditForm");
                c.EditCheck("NewColumn").FakeColumn<bool>(v => v.Title("This is fake column not in form"));
            });

            conf.Toolbar("toolbar-rt", c =>
            {
                c.AddSimpleButton("Add new...").AddNewByForm();
                c.AddSimpleButton("Add new by row...").AddNewByRow();
                c.AddCommandButton("Test Selection", "Test").DisableIfNothingChecked();
            });

            conf.Partition(x => x.Server());
            conf.AddColumn<bool>("NewColumn", c => !c.IsPaid, (c, v) => c.IsPaid = !v).Title("New column").ClientExpression("!{IsPaid}");
            conf.Checkboxify();
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