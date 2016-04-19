using PowerTables.Configuration;
using PowerTables.FrequentlyUsed;
using PowerTables.Plugins.Checkboxify;
using PowerTables.Plugins.Toolbar;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<Toy, Row> ButtonsAndCheckboxify(this Configurator<Toy, Row> conf)
        {
            conf.RedirectingFilters();

            conf.Checkboxify(c => c.Id, SelectAllBehavior.CurrentPage, ui => ui.ResetBehavior(resetOnLoad: true));
            conf.Toolbar("toolbar-rt", a =>
            {

                a.AddCommandButton("remove".GlyphIcon() + "Remove selected", Remove)
                    .DisableIfNothingChecked()
                    .ShowMessageResponseCallback();

                a.AddCommandButton("download".GlyphIcon() + "Download", Download);

                a.AddMenu("th".GlyphIcon() + "Confirmations", b =>
                {
                    b.AddCommandItem("star".GlyphIcon("left") + "Simple confirmation", ExportAll)
                        .Confirmation("confirmation1", "#confirmationContent")
                        ;
                    b.AddCommandItem("save".GlyphIcon("left") + "Confirm selection", ExportSelected)
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