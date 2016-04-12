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

        public static Configurator<SourceData, TargetData> ButtonsAndCheckboxify(this Configurator<SourceData, TargetData> conf)
        {
            conf.HideoutAndResponseInfo();
            conf.Checkboxify(c => c.Id, SelectAllBehavior.CurrentPage,resetOnClientLoad:false,resetOnLoad:true);
            conf.Toolbar("toolbar-rt", a =>
            {
                a.AddCommandButton("remove".GlyphIcon() + "Remove selected", Remove)
                    .DisableIfNothingChecked()
                    .ShowMessageResponseCallback();

                a.AddCommandButton("download".GlyphIcon() + "Download", Download);

                a.AddMenu("th".GlyphIcon() + "Excel export", b =>
                {
                    b.AddCommandItem("star".GlyphIcon("left") + "Export all", ExportAll);
                    b.AddCommandItem("save".GlyphIcon("left") + "Export selected", ExportSelected)
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