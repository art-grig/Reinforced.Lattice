using Newtonsoft.Json.Linq;

namespace PowerTables.Editing.Editors.PlainText
{
    public class PlainTextEditorUiConfig : EditFieldUiConfigBase
    {
        public override string PluginId
        {
            get { return "PlainTextEditor"; }
        }

        public string ValidationRegex { get; set; }

        public bool EnableBasicValidation { get; set; }

        public JRaw FormatFunction { get; set; }

        public JRaw ParseFunction { get; set; }

        public string FloatRemoveSeparatorsRegex { get; set; }

        public string FloatDotReplaceSeparatorsRegex { get; set; }

        public bool AllowEmptyString { get; set; }

        public int MaxAllowedLength { get; set; }

        public PlainTextEditorUiConfig()
        {
            FloatDotReplaceSeparatorsRegex = "[,]";
            FloatRemoveSeparatorsRegex = "[\\s]";

            EnableBasicValidation = true;
            TemplateId = "plainTextEditor";
        }
    }
}
