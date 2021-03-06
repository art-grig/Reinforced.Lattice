﻿using System;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using Reinforced.Lattice.CellTemplating;

namespace Reinforced.Lattice.Editing.Editors.Display
{
    public static class DisplayingEditorConfigurationExtensions
    {
        /// <summary>
        /// Obtains configurator for checkbox editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, TData, DisplayingEditorUiConfig> Display<TForm, TClientConfig, TData>(this EditHandlerConfiguration<TForm, TClientConfig> t, Expression<Func<TForm, TData>> field)
                        where TClientConfig : EditFormUiConfigBase, new()

        {
            return t.GetFieldConfiguration<TData, DisplayingEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
        }

        /// <summary>
        /// Obtains configurator for checkbox editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="fieldName">Field name (may be not pesent in form object)</param>
        /// <returns>Fluent</returns>
        public static IEditFieldUsage<DisplayingEditorUiConfig> Display<TData>(this INongenericHandlerConfiguration t, string fieldName)
        {
            return t.GetFieldNongenericConfiguration<TData, DisplayingEditorUiConfig>(fieldName);
        }

        /// <summary>
        /// Specifies template for editor
        /// </summary>
        /// <param name="conf"></param>
        /// <param name="templateBuilder"></param>
        public static void DisplayTemplate(this IEditFieldUsage<DisplayingEditorUiConfig> conf, Action<CellTemplateBuilder> templateBuilder)
        {
            var ctpl = new CellTemplateBuilder("ModifiedDataObject");
            templateBuilder(ctpl);

            conf.UiConfig.Template = new JRaw(ctpl.Build());
        }
    }
}
