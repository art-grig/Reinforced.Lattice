using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace PowerTables.Editors.PlainText
{
    public class PlainTextEditorUiConfig : CellEditorUiConfigBase
    {
        public override string PluginId
        {
            get { return "PlainTextEditor"; }
        }

        public string ValidationRegex { get; set; }

        public string RegexValidationErrorText { get; set; }

        public bool EnableBasicValidation { get; set; }

        public JRaw FormatFunction { get; set; }

        public JRaw ParseFunction { get; set; }

        public string FloatRemoveSeparatorsRegex { get; set; }

        public string FloatDotReplaceSeparatorsRegex { get; set; }

        public bool AllowEmptyString { get; set; }

        public PlainTextEditorUiConfig()
        {
            FloatDotReplaceSeparatorsRegex = "[,]";
            FloatRemoveSeparatorsRegex = "[\\s]";

            EnableBasicValidation = true;
        }
    }
}
