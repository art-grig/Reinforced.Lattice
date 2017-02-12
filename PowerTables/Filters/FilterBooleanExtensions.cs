using System;
using System.Linq;
using System.Linq.Expressions;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Filters.Select;
using Reinforced.Lattice.Filters.Value;
using Reinforced.Lattice.Plugins;

namespace Reinforced.Lattice.Filters
{
    public static class FilterBooleanExtensions
    {
        /// <summary>
        /// Shortcut for creating multi-select filter for boolean value
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="column">Column configuration</param>
        /// <param name="sourceColumn">Source column</param>
        /// <param name="trueText">Text for true</param>
        /// <param name="falseText">Text for false</param>
        /// <param name="bothText">Text for both value (a.k.a. "not matter")</param>
        /// <param name="allowBoth">Allow "not matter" case or not</param>
        /// <param name="ui">UI builder</param>
        /// <returns>Value filter</returns>
        public static ValueColumnFilter<TSourceData, bool>
            FilterBoolean
            <TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, bool> column,
            Expression<Func<TSourceData, bool>> sourceColumn,
            string trueText, string falseText, string bothText = null, bool allowBoth = true,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig, bool>> ui = null
            ) where TTableData : new()
        {
            var items = new[]
            {
                new UiListItem {Text = trueText,Value = "True"},
                new UiListItem {Text = falseText,Value = "False"}
            };

            var cf = column.FilterSelect(sourceColumn, v =>
            {
                v.SelectAny(allowBoth, bothText).SelectItems(items);
                if (ui != null) ui(v);
            });
            return cf;

        }

        /// <summary>
        /// Shortcut for creating multi-select filter for boolean value
        /// </summary>
        /// <typeparam name="TSourceData"></typeparam>
        /// <typeparam name="TTableData"></typeparam>
        /// <param name="column">Column configuration</param>
        /// <param name="filterDelegate"></param>
        /// <param name="trueText">Text for true</param>
        /// <param name="falseText">Text for false</param>
        /// <param name="bothText">Text for both value (a.k.a. "not matter")</param>
        /// <param name="allowBoth">Allow "not matter" case or not</param>
        /// <param name="ui">UI builder</param>
        /// <returns>Value filter</returns>
        public static ValueColumnFilter<TSourceData, bool>
            FilterBooleanBy
            <TSourceData, TTableData>(
            this ColumnUsage<TSourceData, TTableData, bool> column,
            Func<IQueryable<TSourceData>, bool, IQueryable<TSourceData>> filterDelegate,
            string trueText, string falseText, string bothText = null, bool allowBoth = true,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig, bool>> ui = null
            ) where TTableData : new()
        {
            var items = new[]
            {
                new UiListItem {Text = trueText,Value = "True"},
                new UiListItem {Text = falseText,Value = "False"}
            };

            var cf = column.FilterSelectBy(filterDelegate, v =>
            {
                v.SelectAny(allowBoth, bothText).SelectItems(items);
                if (ui != null) ui(v);
            });
            return cf;

        }

        /// <summary>
        /// Shortcut for creating multi-select filter for boolean value
        /// </summary>
        /// <param name="column">Column configuration</param>
        /// <param name="trueText">Text for true</param>
        /// <param name="falseText">Text for false</param>
        /// <param name="bothText">Text for both value (a.k.a. "not matter")</param>
        /// <param name="allowBoth">Allow "not matter" case or not</param>
        /// <returns>Value filter</returns>
        public static void FilterBooleanUi(this IColumnTargetProperty<bool> column,
            string trueText, string falseText, string bothText = null, bool allowBoth = true,
            Action<ColumnPluginConfigurationWrapper<SelectFilterUiConfig, bool>> ui = null
            )
        {
            var items = new[]
            {
                new UiListItem {Text = trueText,Value = "True"},
                new UiListItem {Text = falseText,Value = "False"}
            };

            column.FilterSelectUi(v =>
            {
                v.SelectAny(allowBoth, bothText).SelectItems(items);
                if (ui != null) ui(v);
            });
        }



    }
}
