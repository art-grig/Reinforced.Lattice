﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Web.Mvc;

namespace PowerTables.Editing.Editors.SelectList
{
    public static class SelectListUiConfigurationExtensions
    {
        public static EditFieldUsage<TForm, TData, SelectListEditorUiConfig> EditSelectList<TForm, TData, TClientConfig>(
            this EditHandlerConfiguration<TForm, TClientConfig> t, 
            Expression<Func<TForm, TData>> field) 
            where TClientConfig : EditFormUiConfigBase, new()
        {
            return t.GetFieldConfiguration<TData, SelectListEditorUiConfig>(LambdaHelpers.ParsePropertyLambda(field));
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
            this IEditFieldUsage<SelectListEditorUiConfig> t, IEnumerable<SelectListItem> selectItems)
        {
            t.UiConfig.SelectListItems = selectItems.ToList();
            return t;
        }

        public static IEditFieldUsage<SelectListEditorUiConfig> AddItem(
            this IEditFieldUsage<SelectListEditorUiConfig> t, SelectListItem item)
        {
            t.UiConfig.SelectListItems.Add(item);
            return t;
        }
        
    }
}