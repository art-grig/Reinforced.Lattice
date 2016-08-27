using System;
using System.Linq.Expressions;

namespace PowerTables.Editing.Editors.Memo
{
    public static class MemoUiConfigurationExtensions
    {
        /// <summary>
        /// Obtains configurator for checkbox editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, TData, MemoEditorUiConfig> EditMemo<TForm, TData, TClientConfig>(this EditHandlerConfiguration<TForm, TClientConfig> t, Expression<Func<TForm, TData>> field)
            where TClientConfig : EditFormUiConfigBase
        {
            return t.GetFieldConfiguration<TData, MemoEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
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
