using System;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using PowerTables.CellTemplating;
using PowerTables.Editing.Form;

namespace PowerTables.Editing.Editors.Display
{
    public static class DisplayingEditorConfigurationExtensions
    {
        /// <summary>
        /// Obtains configurator for checkbox editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, TData, DisplayingEditorUiConfig> Display<TForm, TData>(this EditHandlerConfiguration<TForm, FormEditUiConfig> t, Expression<Func<TForm, TData>> field)
        {
            return t.GetFieldConfiguration<TData, DisplayingEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
        }

        public static void Template<TForm, TData>(this EditFieldUsage<TForm, TData, DisplayingEditorUiConfig> conf, Action<CellTemplateBuilder> templateBuilder)
        {
            var ctpl = new CellTemplateBuilder("ModifiedDataObject");
            templateBuilder(ctpl);

            conf.UiConfig.Template = new JRaw(ctpl.Build());
        }
    }
}
