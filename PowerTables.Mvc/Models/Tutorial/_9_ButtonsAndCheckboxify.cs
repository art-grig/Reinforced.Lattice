using PowerTables.Configuration;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Toolbar;

namespace PowerTables.Mvc.Models.Tutorial
{
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

            conf.Checkboxify(c => c.Id, SelectAllBehavior.CurrentPage, ui => ui.ResetBehavior(resetOnLoad: true));
            conf.AdjustmentTemplates("updatedRow", "updatedCell", "addedRow");


            conf.Toolbar("toolbar-rt", a =>
            {

                a.AddCommandButton(Remove.GlyphIcon() + " Remove selected", Remove)
                    .DisableIfNothingChecked();

                a.AddCommandButton(Download.GlyphIcon() + " Download", Download);

                a.AddMenu("th".GlyphIcon() + "Confirmations", b =>
                {
                    b.AddCommandItem("star".GlyphIcon("left") + " Simple confirmation", Remove)
                        .Confirmation("simpleConfirmation", "#confirmationContent")
                        ;
                    b.AddCommandItem("save".GlyphIcon("left") + " Confirm selection", Remove)
                        .Confirmation("confirmationSelection", "#confirmationContent")
                        
                        .DisableIfNothingChecked();
                    b.AddCommandItem("save".GlyphIcon("left") + " Confirm with small form", Update)
                        .Confirmation("confirmationSelectionForm", "#confirmationContent")
                        .ConfirmationForm<SimpleConfirmationModel>(c => c.WatchAllFields())
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