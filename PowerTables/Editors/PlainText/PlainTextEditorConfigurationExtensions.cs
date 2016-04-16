using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Editors.PlainText
{
    public static class PlainTextEditorConfigurationExtensions
    {
        public static ColumnUsage<TSourceData, TTableData, TTableColumn> EditPlainText<TSourceData, TTableData, TTableColumn>(this ColumnUsage<TSourceData, TTableData, TTableColumn> t, Action<EditorConfigurationWrapper<PlainTextEditorUiConfig>> config = null) where TTableData : new()
        {
            t.TableConfigurator.TableConfiguration.UpdatePluginConfig<EditorUiConfig>(EditorExtensions.PluginId, c =>
            {
                var conf =
                    c.Configuration.GetOrReplaceEditorConfig<PlainTextEditorUiConfig>(
                        t.ColumnConfiguration.RawColumnName);

                var wrapper = new EditorConfigurationWrapper<PlainTextEditorUiConfig>(conf);
                if (config != null) config(wrapper);
            });

            return t;
        }

        public static EditorConfigurationWrapper<PlainTextEditorUiConfig> CanTypeEmpty(
            this EditorConfigurationWrapper<PlainTextEditorUiConfig> t, bool allow = true)
        {
            t.EditorConfig.AllowEmptyString = allow;
            return t;
        }

        public static EditorConfigurationWrapper<PlainTextEditorUiConfig> FloatRegexes(
            this EditorConfigurationWrapper<PlainTextEditorUiConfig> t, string removeSeparator = null,string replaceDotSeparator = null)
        {
            if (!string.IsNullOrEmpty(removeSeparator)) t.EditorConfig.FloatRemoveSeparatorsRegex = removeSeparator;
            if (!string.IsNullOrEmpty(replaceDotSeparator)) t.EditorConfig.FloatDotReplaceSeparatorsRegex = replaceDotSeparator;
            return t;
        }

        public static EditorConfigurationWrapper<PlainTextEditorUiConfig> ValidationRegex(
            this EditorConfigurationWrapper<PlainTextEditorUiConfig> t, string validationRegex)
        {
            t.EditorConfig.ValidationRegex = validationRegex;
            return t;
        }

        public static EditorConfigurationWrapper<PlainTextEditorUiConfig> DisableBasicValidation(
            this EditorConfigurationWrapper<PlainTextEditorUiConfig> t, bool disable = true)
        {
            t.EditorConfig.EnableBasicValidation = !disable;
            return t;
        }

        public static EditorConfigurationWrapper<PlainTextEditorUiConfig> FormatAndParseFunctions(
            this EditorConfigurationWrapper<PlainTextEditorUiConfig> t, string formatFunction = null,string parseFunction = null)
        {
            if (!string.IsNullOrEmpty(formatFunction)) t.EditorConfig.FormatFunction = new JRaw(formatFunction);
            if (!string.IsNullOrEmpty(parseFunction)) t.EditorConfig.ParseFunction = new JRaw(parseFunction);
            return t;
        }

        public static EditorConfigurationWrapper<PlainTextEditorUiConfig> MaxLength(
            this EditorConfigurationWrapper<PlainTextEditorUiConfig> t, int maxLength)
        {
            t.EditorConfig.MaxAllowedLength = maxLength;
            return t;
        }
    }
}
