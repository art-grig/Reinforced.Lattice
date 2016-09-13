using System;
using System.Linq.Expressions;

namespace PowerTables.Editing.Editors.Check
{
    public static class CheckEditorConfigurationExtensions
    {
        /// <summary>
        /// Validation message key in case if mandatory checkbox have not been checked
        /// </summary>
        public const string Validation_Mandatory = "MANDATORY";

        /// <summary>
        /// Obtains configurator for checkbox editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, bool, CheckEditorUiConfig> EditCheck<TForm, TClientConfig>(this EditHandlerConfiguration<TForm, TClientConfig> t, Expression<Func<TForm, bool>> field)
            where TClientConfig : EditFormUiConfigBase, new()
        {
            return t.GetFieldConfiguration<bool, CheckEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
        }

        /// <summary>
        /// Obtains configurator for checkbox editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="fieldName">Field name (may be not pesent in form)</param>
        /// <returns>Fluent</returns>
        public static IEditFieldUsage<CheckEditorUiConfig> EditCheck(this INongenericHandlerConfiguration t, string fieldName)
        {
            return t.GetFieldNongenericConfiguration<bool, CheckEditorUiConfig>(fieldName);
        }

        /// <summary>
        /// Obtains configurator for checkbox editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, bool?, CheckEditorUiConfig> EditCheck<TForm, TClientConfig>(this EditHandlerConfiguration<TForm, TClientConfig> t, Expression<Func<TForm, bool?>> field)
            where TClientConfig : EditFormUiConfigBase, new()
        {
            return t.GetFieldConfiguration<bool?, CheckEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
        }


        /// <summary>
        /// Make checkbox mandatory to be checked. E.g. validation eroor will be thrown if checkbox for this column is unchecked
        /// </summary>
        /// <param name="t"></param>
        /// <param name="mandatory">Is checkbox mandatory or not</param>
        /// <returns></returns>
        public static IEditFieldUsage<CheckEditorUiConfig> Mandatory(
            this IEditFieldUsage<CheckEditorUiConfig> t, bool mandatory = true)
        {
            t.UiConfig.IsMandatory = true;
            return t;
        }
    }
}
