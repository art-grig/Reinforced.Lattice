using PowerTables.Configuration;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Toolbar;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public const string Remove = "remove";
        public const string Download = "download";
        public const string ExportSelected = "export-selected";
        public const string ExportAll = "export-selected";

        public static Configurator<Toy, Row> ButtonsAndCheckboxify(this Configurator<Toy, Row> conf)
        {
            conf.Filtering();

            conf.Checkboxify(c => c.Id, SelectAllBehavior.CurrentPage, ui => ui.ResetBehavior(resetOnLoad: true));
            conf.Toolbar("toolbar-rt", a =>
            {

                a.AddCommandButton("remove".GlyphIcon() + "Remove selected", Remove)
                    .DisableIfNothingChecked();

                a.AddCommandButton("download".GlyphIcon() + "Download", Download);

                a.AddMenu("th".GlyphIcon() + "Confirmations", b =>
                {
                    b.AddCommandItem("star".GlyphIcon("left") + "Simple confirmation", ExportAll)
                        .Confirmation("simpleConfirmation", "#confirmationContent")
                        ;
                    b.AddCommandItem("save".GlyphIcon("left") + "Confirm selection", ExportSelected)
                        .Confirmation("confirmationSelection", "#confirmationContent")
                        .DisableIfNothingChecked();
                    b.AddCommandItem("save".GlyphIcon("left") + "Confirm with small form", ExportSelected)
                        .DisableIfNothingChecked();

                }).Css("btn-primary");

                a.AddMenuButton("record".GlyphIcon() + "And this is button menu", "something", b =>
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