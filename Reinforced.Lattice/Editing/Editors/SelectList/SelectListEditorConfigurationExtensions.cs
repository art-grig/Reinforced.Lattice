﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;
using Reinforced.Lattice.CellTemplating;

namespace Reinforced.Lattice.Editing.Editors.SelectList
{
    public static class SelectListUiConfigurationExtensions
    {

        /// <summary>
        /// Validation message key in case if empty/null value selected in the editor select list
        /// </summary>
        public const string Validation_Null = "NULL";

        /// <summary>
        /// Obtains configurator for select list editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="field">Field selector</param>
        /// <returns>Fluent</returns>
        public static EditFieldUsage<TForm, TData, SelectListEditorUiConfig> EditSelectList<TForm, TData, TClientConfig>(
            this EditHandlerConfiguration<TForm, TClientConfig> t,
            Expression<Func<TForm, TData>> field)
            where TClientConfig : EditFormUiConfigBase, new()
        {
            return t.GetFieldConfiguration<TData, SelectListEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
        }

        /// <summary>
        /// Obtains configurator for select list editor for specified field
        /// </summary>
        /// <param name="t">Column configurator</param>
        /// <param name="fieldName">Field name (may be not pesent in form object)</param>
        /// <returns>Fluent</returns>
        public static IEditFieldUsage<SelectListEditorUiConfig> EditSelectList<TData>(this INongenericHandlerConfiguration t, string fieldName)
        {
            return t.GetFieldNongenericConfiguration<TData, SelectListEditorUiConfig>(fieldName);
        }

        public static IEditFieldUsage<SelectListEditorUiConfig> CanSelectEmpty(
            this IEditFieldUsage<SelectListEditorUiConfig> t, bool allow = true)
        {
            t.UiConfig.AllowEmptyString = allow;
            return t;
        }

        public static IEditFieldUsage<SelectListEditorUiConfig> WithEmptyElement(
            this IEditFieldUsage<SelectListEditorUiConfig> t, string elementText = "Empty", bool allowEmpty = true)
        {
            t.UiConfig.AllowEmptyString = allowEmpty;
            t.UiConfig.AddEmptyElement = true;
            t.UiConfig.EmptyElementText = elementText;
            return t;
        }

        public static IEditFieldUsage<SelectListEditorUiConfig> Items(
            this IEditFieldUsage<SelectListEditorUiConfig> t, IEnumerable<UiListItem> selectItems)
        {
            t.UiConfig.SelectListItems = selectItems.ToList();
            return t;
        }

        public static IEditFieldUsage<SelectListEditorUiConfig> AddItem(
            this IEditFieldUsage<SelectListEditorUiConfig> t, UiListItem item)
        {
            t.UiConfig.SelectListItems.Add(item);
            return t;
        }


        public static IEditFieldUsage<SelectListEditorUiConfig> MissingKeyValue(
            this IEditFieldUsage<SelectListEditorUiConfig> t, string missingKeyExpression, string missingValueExpression)
        {
            var missingKey = string.Format("function(x){{ return {0}; }}",Template.CompileExpression(missingKeyExpression, "x", string.Empty,t.UiConfig.FieldName));
            var missingValue = string.Format("function(x){{ return {0}; }}",Template.CompileExpression(missingValueExpression, "x", string.Empty,t.UiConfig.FieldName));

            t.UiConfig.MissingKeyFunction = new JRaw(missingKey);
            t.UiConfig.MissingValueFunction = new JRaw(missingValue);

            return t;
        }
    }
}
