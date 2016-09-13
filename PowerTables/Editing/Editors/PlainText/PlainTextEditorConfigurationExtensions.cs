using System;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;

namespace PowerTables.Editing.Editors.PlainText
{

    public static class PlainTextEditorConfigurationExtensions
    {
        /// <summary>
        /// Validation message key in case if text editor contents does not represent valid boolean value
        /// </summary>
        public const string Validation_NonBool = "NONBOOL";

        /// <summary>
        /// Validation message key in case if text editor contents does not represent valid floating-point value
        /// </summary>
        public const string Validation_NonFloat = "NONFLOAT";

        /// <summary>
        /// Validation message key in case if text editor contents does not represent valid integer value
        /// </summary>
        public const string Validation_NonInt = "NONINT";

        /// <summary>
        /// Validation message key in case if memo contents exceeded maximum possible length
        /// </summary>
        public const string Validation_Maxchars = "MAXCHARS";

        /// <summary>
        /// Validation message key in case if text editor contents are empty string
        /// </summary>
        public const string Validation_Emptystring = "EMPTYSTRING";

        /// <summary>
        /// Validation message key in case if text editor contents are not present
        /// </summary>
        public const string Validation_Null = "NULL";

        /// <summary>
        /// Validation message key in case if text editor contents does not match specified regular expression
        /// </summary>
        public const string Validation_Regex = "REGEX";

        /// <summary>
        /// Obtains configurator for plain text editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, TData, PlainTextEditorUiConfig> EditPlainText<TForm, TData, TClientConfig>(this EditHandlerConfiguration<TForm, TClientConfig> t, Expression<Func<TForm, TData>> field)
            where TClientConfig : EditFormUiConfigBase, new()
        {
            return t.GetFieldConfiguration<TData, PlainTextEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
        }

        /// <summary>
        /// Obtains configurator for plain text editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="fieldName">Field name (may be not pesent in form object)</param>
        /// <returns>Fluent</returns>
        public static IEditFieldUsage<PlainTextEditorUiConfig> EditPlainText<TData>(this INongenericHandlerConfiguration t, string fieldName)
        {
            return t.GetFieldNongenericConfiguration<TData, PlainTextEditorUiConfig>(fieldName);
        }

        public static IEditFieldUsage<PlainTextEditorUiConfig> CanTypeEmpty(this IEditFieldUsage<PlainTextEditorUiConfig> t, bool allow = true)
        {
            t.UiConfig.AllowEmptyString = allow;
            return t;
        }

        public static IEditFieldUsage<PlainTextEditorUiConfig> FloatRegexes(this IEditFieldUsage<PlainTextEditorUiConfig> t, string removeSeparator = null, string replaceDotSeparator = null)
        {
            if (!string.IsNullOrEmpty(removeSeparator)) t.UiConfig.FloatRemoveSeparatorsRegex = removeSeparator;
            if (!string.IsNullOrEmpty(replaceDotSeparator)) t.UiConfig.FloatDotReplaceSeparatorsRegex = replaceDotSeparator;
            return t;
        }

        public static IEditFieldUsage<PlainTextEditorUiConfig> ValidationRegex(this IEditFieldUsage<PlainTextEditorUiConfig> t, string validationRegex)
        {
            t.UiConfig.ValidationRegex = validationRegex;
            return t;
        }

        public static IEditFieldUsage<PlainTextEditorUiConfig> DisableBasicValidation(this IEditFieldUsage<PlainTextEditorUiConfig> t, bool disable = true)
        {
            t.UiConfig.EnableBasicValidation = !disable;
            return t;
        }

        public static IEditFieldUsage<PlainTextEditorUiConfig> FormatAndParseFunctions(
            this IEditFieldUsage<PlainTextEditorUiConfig> t, string formatFunction = null, string parseFunction = null)
        {
            if (!string.IsNullOrEmpty(formatFunction)) t.UiConfig.FormatFunction = new JRaw(formatFunction);
            if (!string.IsNullOrEmpty(parseFunction)) t.UiConfig.ParseFunction = new JRaw(parseFunction);
            return t;
        }

        public static IEditFieldUsage<PlainTextEditorUiConfig> MaxLength(
            this IEditFieldUsage<PlainTextEditorUiConfig> t, int maxLength)
        {
            t.UiConfig.MaxAllowedLength = maxLength;
            return t;
        }
    }
}
