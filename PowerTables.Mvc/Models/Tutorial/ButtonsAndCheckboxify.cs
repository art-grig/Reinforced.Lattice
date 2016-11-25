using System;
using System.Linq;
using System.Web.Mvc;
using PowerTables.CellTemplating;
using PowerTables.Commands;
using PowerTables.Configuration;
using PowerTables.Editing;
using PowerTables.Editing.Editors.Check;
using PowerTables.Editing.Editors.Memo;
using PowerTables.Editing.Editors.PlainText;
using PowerTables.Editing.Editors.SelectList;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Toolbar;

namespace PowerTables.Mvc.Models.Tutorial
{
    public class CommentForm
    {
        public string CommentText { get; set; }

        public string Email { get; set; }

        public int Rate { get; set; }

        public bool ShowMyEmail { get; set; }
    }

    public class CommentsValidationForm
    {
        public bool Validated { get; set; }

        public DateTime CommentDate { get; set; }
    }

    public class PriceRange
    {
        public decimal? StartPrice { get; set; }

        public decimal? EndPrice { get; set; }
    }

    public class DetailsModel
    {
        public decimal AveragePrice { get; set; }
        public int ItemsCount { get; set; }

    }
    public static partial class Tutorial
    {
        public const string Remove = "remove";
        public const string Update = "update";
        public const string Download = "download";
        public const string ExportSelected = "export-selected";
        public const string ExportAll = "export-selected";

        public static Configurator<Toy, Row> ButtonsAndCheckboxify(this Configurator<Toy, Row> conf)
        {
            conf.Filtering();

            conf.Checkboxify();

            var rateItems = Enumerable.Range(1, 5).OrderByDescending(c => c).Select(c => new SelectListItem()
            {
                Text = c + " stars",
                Value = c.ToString()
            });

            conf
                .Command(Remove, x => x.Window("simpleConfirmation", "#confirmationContent"))
                .Command("Remove2", x => x.Server(Remove).Window("simpleConfirmation", "#confirmationContent"))
                .Command(Update,
                    x =>
                        x.Window<SimpleConfirmationModel>("confirmationSelectionForm", "#confirmationContent",
                            c => c.WatchForm(d => d.WatchAllFields())))
                .Command("Remove3", x =>
                {
                    x.Server(Remove)
                        .Window("removalConfirmation", "#confirmationContent",
                            d => d.Part("Name", "Toy").Part("NamePlural", "toys"));

                })
                .Command("LeaveComment", x =>
                {
                    x.Window<CommentForm>("commentConfirmation", "#confirmationContent", d =>
                    {
                        d.AutoForm(c =>
                        {
                            c.EditMemo(v => v.CommentText).FakeColumn(n => n.Title("Comment"));
                            c.EditPlainText(v => v.Email)
                                .OverrideErrorMessage(PlainTextEditorConfigurationExtensions.Validation_Emptystring,
                                    "Email is required")
                                .FakeColumn(n => n.Title("Your Email"));
                            c.EditSelectList(v => v.Rate).FakeColumn(n => n.Title("Rate")).Items(rateItems);
                            c.EditCheck(v => v.ShowMyEmail).FakeColumn(n => n.Title("Show My Email"));
                        });
                    });
                })
                .Command("ViewComments", x =>
                {
                    x.Window("commentsView", "#confirmationContent", z => z.ContentCommand("LoadComments"));
                })
                .Command("CommentFeedback", x =>
                {
                    x.Window<CommentsValidationForm>("commentsAndFeedback", "#confirmationContent", d =>
                    {
                        d.AutoForm(c =>
                        {
                            c.EditCheck(v => v.Validated)
                                .FakeColumn(n => n.Title("Validated"))
                                .OverrideErrorMessage(CheckEditorConfigurationExtensions.Validation_Mandatory,
                                    "You must validate comments")
                                .Mandatory()
                                ;
                            c.EditPlainText(v => v.CommentDate)
                                .FakeColumn(n => n.Title("Validated at"));

                        });
                        d.ContentCommand("LoadComments");
                    });
                })
                .Command("CommentDetails", x =>
                {
                    x.Window<PriceRange>("detailsTest", "#confirmationContent", d =>
                    {
                        d.AutoForm(c =>
                        {
                            c.EditPlainText(v => v.StartPrice)
                                .FakeColumn(n => n.Title("Start"))
                                .CanTypeEmpty()
                                ;
                            c.EditPlainText(v => v.EndPrice)
                                .FakeColumn(n => n.Title("End"))
                                .CanTypeEmpty()
                                ;
                        });
                        d.Details(c =>
                        {
                            c.Debounce(100);
                            //c.TemplateId("toysDetails");
                            c.FromCommand("PricesDetails");
                        });
                    });
                });



            conf.Column(c => c.TypeOfToy).Template(x => x.Returns("<a class='btn btn-sm btn-default'>Leave comment</a>"))
                .SubscribeCellEvent(a => a.Command("click", "LeaveComment").Selector("a"));
            conf.Column(c => c.PreviousState).Template(x => x.Returns("<a class='btn btn-sm btn-default'>View Comments</a>"))
               .SubscribeCellEvent(a => a.Command("click", "ViewComments").Selector("a"));
            conf.Column(c => c.ItemsSold).Template(x => x.Returns("<a class='btn btn-sm btn-default'>Feedback</a>"))
               .SubscribeCellEvent(a => a.Command("click", "CommentFeedback").Selector("a"));
            conf.Column(c => c.Preorders).Template(x => x.Returns("<a class='btn btn-sm btn-default'>Details</a>"))
               .SubscribeCellEvent(a => a.Command("click", "CommentDetails").Selector("a"));
            conf.Toolbar("toolbar-rt", a =>
            {

                a.AddCommandButton(Remove.GlyphIcon() + " Remove selected", Remove)
                    .DisableIfNothingChecked();


                a.AddCommandButton(Download.GlyphIcon() + " Download", Download);

                a.AddMenu("th".GlyphIcon() + "Confirmations ", b =>
                {
                    b.AddCommandItem("star".GlyphIcon("left") + " Simple confirmation", Remove);
                    b.AddCommandItem("save".GlyphIcon("left") + " Confirm selection", "Remove2")
                        .DisableIfNothingChecked();
                    b.AddCommandItem("save".GlyphIcon("left") + " Confirm with small form", Update)
                        .DisableIfNothingChecked();
                    b.AddCommandItem(Remove.GlyphIcon() + " Template Pieces", "Remove3")
                    .DisableIfNothingChecked();

                }).Css("btn-primary");

                a.AddMenuButton("record".GlyphIcon() + " And this is button menu", "something", b =>
                {
                    b.AddSimpleItem("Simple active item").Css("active");
                    b.Separator();
                    b.AddSimpleItem("Simple inactive item");

                }).Css("btn-primary");
            });
            return conf;
        }
    }
}