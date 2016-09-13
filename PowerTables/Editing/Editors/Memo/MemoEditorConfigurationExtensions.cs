using System;
using System.Linq.Expressions;

namespace PowerTables.Editing.Editors.Memo
{
    public static class MemoUiConfigurationExtensions
    {
        /// <summary>
        /// Validation message key in case if memo contents exceeded maximum possible length
        /// </summary>
        public const string Validation_Maxchars = "MAXCHARS";

        /// <summary>
        /// Obtains configurator for memo editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, TData, MemoEditorUiConfig> EditMemo<TForm, TData, TClientConfig>(this EditHandlerConfiguration<TForm, TClientConfig> t, Expression<Func<TForm, TData>> field)
            where TClientConfig : EditFormUiConfigBase, new()
        {
            return t.GetFieldConfiguration<TData, MemoEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
        }

        /// <summary>
        /// Obtains configurator for memo editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="fieldName">Field name (may be not pesent in form object)</param>
        /// <returns>Fluent</returns>
        public static IEditFieldUsage<MemoEditorUiConfig> EditMemo<TData>(this INongenericHandlerConfiguration t, string fieldName)
        {
            return t.GetFieldNongenericConfiguration<TData, MemoEditorUiConfig>(fieldName);
        }

        public static IEditFieldUsage<MemoEditorUiConfig> MaxChars(
            this IEditFieldUsage<MemoEditorUiConfig> t, int charsWarning = 0, int charsError = 0)
        {
            t.UiConfig.MaxChars = charsError;
            t.UiConfig.WarningChars = charsWarning;
            return t;
        }

        public static IEditFieldUsage<MemoEditorUiConfig> Size(
            this IEditFieldUsage<MemoEditorUiConfig> t, int rows = 0, int cols = 0)
        {
            t.UiConfig.Rows = rows;
            t.UiConfig.Columns = cols;
            return t;
        }

        public static IEditFieldUsage<MemoEditorUiConfig> AllowEmptyString(
            this IEditFieldUsage<MemoEditorUiConfig> t, bool allow = true)
        {
            t.UiConfig.AllowEmptyString = allow;
            return t;
        }
    }
}
